from django.db.models import Subquery, OuterRef, Q, Exists

from jcourse_api.models import *
from jcourse_api.features import FEATURE_KEYWORD_MAP


def get_semesters():
    return Semester.objects.all()


def get_announcements():
    return Announcement.objects.filter(available=True)


def _annotate_features(queryset):
    for key, (_, keywords) in FEATURE_KEYWORD_MAP.items():
        kw_q = Q()
        for kw in keywords:
            kw_q |= Q(comment__contains=kw)
        queryset = queryset.annotate(**{
            f"has_feature_{key}": Exists(Review.objects.filter(kw_q, course=OuterRef('pk')))
        })
    return queryset


def get_course_list_queryset(user: User):
    qs = Course.objects.select_related('main_teacher').prefetch_related('categories', 'department')
    return _annotate_features(qs)


def _build_term_q(term: str) -> Q:
    return (
        Q(code__icontains=term) |
        Q(name__icontains=term) |
        Q(main_teacher__name__icontains=term) |
        Q(main_teacher__pinyin__iexact=term) |
        Q(main_teacher__abbr_pinyin__icontains=term)
    )


def _cjk_chars(s: str) -> list[str]:
    """Extract CJK characters from string."""
    return [c for c in s if '一' <= c <= '鿿']


def _char_and_name_q(chars: list[str]) -> Q:
    """Course name must contain ALL listed characters (in any order)."""
    q = Q()
    for c in chars:
        q &= Q(name__contains=c)
    return q


def get_search_course_queryset(q: str, user: User):
    from django.db.models import F, Case, When, IntegerField
    from jcourse_api.aliases import SEARCH_ALIASES

    courses = get_course_list_queryset(user)
    if q == '':
        return courses.none()

    # 1. Exact / alias search (covers course code, name, teacher)
    terms = [q] + SEARCH_ALIASES.get(q, [])
    exact_q = Q()
    for term in terms:
        exact_q |= _build_term_q(term)

    # 2. Character AND fuzzy matching on course name (2+ CJK chars)
    cjk = _cjk_chars(q)
    fuzzy_q = _char_and_name_q(cjk) if len(cjk) >= 2 else Q()

    courses = courses.filter(exact_q | fuzzy_q)

    # Rank: exact match first, then fuzzy-only; within each tier sort by reviews
    courses = courses.annotate(
        match_tier=Case(
            When(exact_q, then=0),   # exact / alias match → tier 0 (best)
            default=1,               # fuzzy-only match    → tier 1
            output_field=IntegerField(),
        ),
        has_reviews=Case(
            When(review_count__gt=0, then=0),
            default=1,
            output_field=IntegerField(),
        ),
    ).order_by(
        'match_tier',
        'has_reviews',
        F('review_count').desc(nulls_last=True),
        F('review_avg').desc(nulls_last=True),
        'name',
    )

    return courses


def get_reviews(user: User):
    # Optimize with select_related and prefetch_related to avoid N+1 queries
    reviews = Review.objects.select_related(
        'course', 
        'course__main_teacher', 
        'course__department',
        'semester',
        'user'
    ).prefetch_related(
        'course__categories'
    )
    
    if not user.is_authenticated:
        return reviews
    
    # Use a more efficient subquery for user reactions
    my_reaction = ReviewReaction.objects.filter(
        user=user, 
        review_id=OuterRef('pk')
    ).values('reaction')
    
    return reviews.annotate(my_reaction=Subquery(my_reaction[:1]))


def get_enrolled_courses(user: User):
    if not user.is_authenticated:
        return EnrollCourse.objects.none()
    return EnrollCourse.objects.filter(user=user).values('semester_id', 'course_id')


def get_my_reviewed(user: User):
    if not user.is_authenticated:
        return Review.objects.none()
    return Review.objects.filter(user=user).values('course_id', 'semester_id', 'id')

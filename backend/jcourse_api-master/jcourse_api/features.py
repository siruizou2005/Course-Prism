# Maps ASCII key → (display_name, keyword_list)
# Used to annotate courses with feature flags from review text
FEATURE_KEYWORD_MAP = {
    "no_rollcall":    ("不点名",    ["不点名", "没有点名", "不用点名", "不签到", "不查勤", "不用签到"]),
    "easy_grading":   ("给分友好",  ["给分友好", "给分慷慨", "给分高", "分数高", "高分", "分给得高", "给分不难", "给分大方"]),
    "light_homework":  ("作业少",    ["作业少", "没有作业", "不布置作业", "作业不多", "作业量少", "几乎没作业", "作业轻松"]),
    "exam_hints":     ("期末划重点", ["划重点", "画重点", "期末复习", "考前复习", "划了重点", "给重点", "圈重点", "押题"]),
    "online":         ("线上",      ["线上", "网课", "在线上课", "线上课", "腾讯会议", "钉钉", "雨课堂"]),
    "practical":      ("实践课",    ["实践课", "实验课", "上机", "实验", "实践", "动手"]),
    "clear_teaching": ("讲课清晰",  ["讲课清晰", "讲解清楚", "条理清晰", "讲得好", "听得懂", "讲得清楚", "思路清晰", "通俗易懂"]),
    "easy_exam":      ("考试简单",  ["考试简单", "考试不难", "期末简单", "考试容易", "期末不难", "很好过", "轻松过"]),
    "open_book":      ("开卷考试",  ["开卷", "开卷考试", "可以带资料", "带书考试", "开放资料"]),
    "high_usual":     ("平时分高",  ["平时分高", "平时分不低", "平时成绩高", "平时给分", "平时分还好", "平时分好"]),
    "group_project":  ("小组项目",  ["小组", "团队作业", "小组作业", "小组项目", "分组", "团队项目"]),
    "recommended":    ("强烈推荐",  ["强烈推荐", "强推", "非常推荐", "值得选", "非常好", "超级推荐", "必选"]),
}

FEATURE_DISPLAY_NAMES = {key: val[0] for key, val in FEATURE_KEYWORD_MAP.items()}
FEATURE_NAME_TO_KEY = {val[0]: key for key, val in FEATURE_KEYWORD_MAP.items()}

import jieba


def cut_word(raw: str):
    seg_list = jieba.cut_for_search(raw)
    segmented_comment = " ".join(seg_list)
    return segmented_comment


def time_mask(value: int) -> str:
    minutes = 0
    if value > 60:
        minutes = value // 60
        seconds = value % 60
    else:
        seconds = value
    
    if seconds < 10:
        return "%d:0%d" % (minutes, seconds)
    return "%d:%d" % (minutes, seconds)

def input_time_mask(field, value: str):
    try:
        value_text = value.replace(":", ".")
        value = float(value_text)
        if len(value_text.split(".")[1]) < 2:
            value /= 10
        else:
            value *= 10
    except:
        if value_text != "":
            value = float(value_text)
            value /= 100
        else:
            value = 0.00
    value_text = "%.2f" % (value)
    field.setText(value_text.replace(".", ":"))

def remove_time_mask(value: str) -> int:
    splited = value.split(":")
    minutes = int(splited[0])
    seconds = int(splited[1])
    seconds += minutes * 60
    return int(seconds)
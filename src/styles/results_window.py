'''
#015A63
#1EE6FC
#049FB0
#632A00
#B04D04
'''

stylesheet = """ 

QPushButton#processButton, QPushButton#exportButton {
    background-color: #015A63;
    height: 50px;
    color: #FFF;
    font-weight: bold;
    border-radius: 4px;
}

QPushButton#exportButton:disabled {
    background-color: rgba(1, 90, 99, 0.5);
}

QPushButton#processButton:hover, QPushButton#exportButton:hover {
    background-color: #017785;
}

QPushButton#processButton:pressed, QPushButton#exportButton:pressed {
    background-color: #029AAB;
}

QLabel#regionLabel {
    color: #1F5D63;
    font-weight: bold;
    font-size: 16px;
}

QLabel#metricLabel {
    color: #049FB0;
    font-weight: bold;
    font-size: 12px;
}

QLabel#valueLabel {
    color: #878787;
    font-weight: bold;
    font-size: 14px;
}

#checkboxGeneration {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 12px;
}

QLineEdit {
    background: transparent;
    border: none;
    font-size: 12px;
}

QSlider {
    min-height: 20px;
}

QSlider::groove:horizontal {
    border: 0px;
    background: qlineargradient(x1:0, y1:0, x2:1, y2:1,
                                stop:0 #777, stop:1 #aaa);
    height: 20px;
    border-radius: 10px;
}

QSlider::handle {
    background: qradialgradient(cx:0, cy:0, radius: 1.2, fx:1,
                                fy:1, stop:0 #049FB0, stop:1 #049FB0);
    height: 20px;
    width: 20px;
    border-radius: 10px;
}

/*
"QSlider::sub-page" is the one exception ...
(it styles the area to the left of the QSlider handle)
*/
QSlider::sub-page:horizontal {
    background: #8ccad1;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

/*
for QRangeSlider: use "qproperty-barColor".  "sub-page" will not work.
*/
QRangeSlider {
    qproperty-barColor: #8ccad1;
}

""" 
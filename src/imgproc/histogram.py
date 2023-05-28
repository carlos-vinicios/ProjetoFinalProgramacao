import numpy as np
import matplotlib.pyplot as plt
import cv2


def create_histogram_plot(color='rgb'):
    fig, ax = plt.subplots()

    lw = 3
    alpha = 0.5
    bins = 16

    ax.set_xlabel('Bin')
    ax.set_ylabel('Frequencia')

    if color == 'rgb':
        ax.set_title('Histograma (RGB)')

        lineR, = ax.plot(np.arange(bins), np.zeros((bins,)),
                         c='r', lw=lw, alpha=alpha, label='Vermelho')
        #lineG, = ax.plot(np.arange(bins), np.zeros((bins,)),
        #                 c='g', lw=lw, alpha=alpha, label='Verde')
        #lineB, = ax.plot(np.arange(bins), np.zeros((bins,)),
        #                 c='b', lw=lw, alpha=alpha, label='Azul')
    else:
        raise Exception("Parâmetro 'color=='{0}' não suportado.".format(color))

    ax.set_xlim(0, bins-1)
    ax.set_ylim(0, 1)
    ax.legend()
    plt.ion()

    return fig, lineR#, lineG, lineB


def get_histogram(img, color='rgb'):
    bins = 16

    if color == 'rgb':
        numPixels = np.prod(img.shape[:2])
    else:
        pass
        
    if color == 'rgb':
        (b, g, r) = cv2.split(img)
        histogramR = cv2.calcHist([r], [0], None, [bins], [0, 255]) / numPixels
        histogramG = cv2.calcHist([g], [0], None, [bins], [0, 255]) / numPixels
        histogramB = cv2.calcHist([b], [0], None, [bins], [0, 255]) / numPixels

        return histogramR, histogramG, histogramB
    else:
        raise Exception("Parâmetro 'color=='{0}' não suportado.".format(color))

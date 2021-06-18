import os
import cv2
import numpy as np
import logging
import time
from keras.models import model_from_json
from keras.preprocessing import image

# print(__file__)
# print(os.path.realpath(__file__))
# print(os.path.abspath(__file__))
#load model
model = model_from_json(open("fer.json", "r").read())

#load weights
model.load_weights('fer.h5')

face_haar_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')


# cap=cv2.VideoCapture(0)
cap=cv2.VideoCapture('img/Child - 33631.mp4')
# img = cv2.imread('img/smile.jpg', cv2.IMREAD_GRAYSCALE)


emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')
emotionValues = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]

begin_time = time.time()

while(cap.isOpened()):

    ret,test_img=cap.read()# captures frame and returns boolean value and captured image
    if not ret:
        continue
    gray_img= cv2.cvtColor(test_img, cv2.COLOR_BGR2GRAY)

    faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)


    for (x,y,w,h) in faces_detected:
        cv2.rectangle(test_img,(x,y),(x+w,y+h),(255,0,0),thickness=7)
        roi_gray=gray_img[y:y+w,x:x+h]#cropping region of interest i.e. face area from  image
        roi_gray=cv2.resize(roi_gray,(48,48))
        img_pixels = image.img_to_array(roi_gray)
        img_pixels = np.expand_dims(img_pixels, axis = 0)
        img_pixels /= 255

        predictions = model.predict(img_pixels)

        #find max indexed array
        max_index = np.argmax(predictions[0])
        max_value = np.max(predictions[0])


        # netural 감정이 최고값이 아닐때,
        if (max_index != 6):
            for i in range(len(emotions)):
                emotionValues[i] += predictions[0][i]
        else:
            logging.warning("except neutral")

        predicted_emotion = emotions[max_index]

        logging.warning(predicted_emotion)
        logging.warning(max_value)
        logging.warning(emotionValues)

        cv2.putText(test_img, predicted_emotion + str(max_value) + "%", (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)

    resized_img = cv2.resize(test_img, (1000, 700))
    cv2.imshow('Facial emotion analysis ',resized_img)


    if cv2.waitKey(10) == ord('q'):#wait until 'q' key is pressed
        break

    # timer
    process_time = time.time() - begin_time;
    if (process_time > 10):
        break

cap.release()
cv2.destroyAllWindows
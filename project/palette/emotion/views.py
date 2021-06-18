from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse, JsonResponse, Http404
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

from .models import Emotion, Question, Result, Final, Qr
from .serializers import EmotionSerializer, QuestionSerializer
import operator
import sqlite3, datetime
User = get_user_model()

import json
import pandas as pd
import random
import datetime
from datetime import datetime

from keras.preprocessing import image
from keras.models import model_from_json
import os
import cv2
import numpy as np
import logging
import time

# text
import matplotlib.pyplot as plt
import re
import urllib.request
from konlpy.tag import Okt
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model

from . import stt

@api_view(['GET'])
def total(request):
    man = User.objects.all().filter(gender=1)
    woman = User.objects.all().filter(gender=2)
    allarr = [['경멸',0],['무력함',0],['당혹감',0],['비통함',0],['격분',0],['공격성',0],['수치심',0],['혼란',0],['근심',0],['불신',0],['역겨움',0],['외경심',0],['절망',0],['경외',0],['두려움',0],['사랑',0],['설렘',0],['낙관',0],['반감',0],['우울함',0],['놀라움',0]]
    marr = [['경멸',0],['무력함',0],['당혹감',0],['비통함',0],['격분',0],['공격성',0],['수치심',0],['혼란',0],['근심',0],['불신',0],['역겨움',0],['외경심',0],['절망',0],['경외',0],['두려움',0],['사랑',0],['설렘',0],['낙관',0],['반감',0],['우울함',0],['놀라움',0]]
    for ac in man:
        emotions = Final.objects.all().filter(userNo=ac.pk)
        for emo in emotions:
            marr[emo.moodType-1][1]+=1
            allarr[emo.moodType-1][1]+=1

    marr.sort(key=lambda x:x[1],reverse=True)

    warr = [['경멸',0],['무력함',0],['당혹감',0],['비통함',0],['격분',0],['공격성',0],['수치심',0],['혼란',0],['근심',0],['불신',0],['역겨움',0],['외경심',0],['절망',0],['경외',0],['두려움',0],['사랑',0],['설렘',0],['낙관',0],['반감',0],['우울함',0],['놀라움',0]]
    for ac in woman:
        emotions = Final.objects.all().filter(userNo=ac.pk)
        for emo in emotions:
            warr[emo.moodType-1][1]+=1
            allarr[emo.moodType-1][1]+=1

    warr.sort(key=lambda x:x[1],reverse=True)
    allarr.sort(key=lambda x:x[1],reverse=True)
    
    man = [marr[0],marr[1],marr[2],marr[3],marr[4]]
    woman = [warr[0],warr[1],warr[2],warr[3],warr[4]]
    all = [allarr[0],allarr[1],allarr[2],allarr[3],allarr[4],allarr[5],allarr[6],allarr[7],allarr[8],allarr[9]]

    return Response({
        'man' : man,
        'woman' : woman,
        'all' : all
    })

@api_view(['GET'])
def search(request):
    tm=request.GET.get('time')
    age=request.GET.get('age')
    account = User.objects.all().filter(age=age)
    arr = [['경멸',0],['무력함',0],['당혹감',0],['비통함',0],['격분',0],['공격성',0],['수치심',0],['혼란',0],['근심',0],['불신',0],['역겨움',0],['외경심',0],['절망',0],['경외',0],['두려움',0],['사랑',0],['설렘',0],['낙관',0],['반감',0],['우울함',0],['놀라움',0]]
    
    for ac in account:
        emotions = Final.objects.all().filter(userNo=ac.pk)
        for emo in emotions:
            time = emo.date
            date_str = time.strftime("%Y-%m-%d %H:%M:%S")
            time = (str)(date_str)
            time = int(time[11:13])/3
            time = int(time)
            if(int(time)!=int(tm)):
                continue
            arr[emo.moodType-1][1]+=1

    arr.sort(key=lambda x:x[1],reverse=True)
    sta = [arr[0],arr[1],arr[2],arr[3],arr[4]]
    
    return Response({
        'time' : tm,
        'age' : age,
        'statistic' : sta
    })

# 검사결과 일마다 날짜마다 결과     username
@api_view(['GET'])
def calendar(request):
    user = User.objects.all().filter(username=request.GET.get('username'))
    if user:
        emotion = Emotion.objects.all().filter(userNo=user[0].pk, option=3).order_by('-date')
        cnt = [[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]],[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]]
        count = [0,0,0,0,0,0,0,0,0,0,0,0]
        et=[]
        t = ''
        for emo in emotion:
            time = emo.date
            date_str = time.strftime("%Y-%m-%d %H:%M:%S")
            time = (str)(date_str)
            time = time[0:10]
            if t==time:
                continue
            t=time
            month = int(time[5:7])
            arr = []
            arr.append(emo.mood1)
            arr.append(emo.mood2)
            arr.append(emo.mood3)
            arr.append(emo.mood4)
            arr.append(emo.mood5)
            arr.append(emo.mood6)
            arr.append(emo.mood7)
            arr2 = arr[:]
            arr.sort(reverse=True)
            fr = arr2.index(arr[0])
            
            cnt[month-1][fr][1] += 1

            cl=[time, fr]
            et.append(cl)
        for i in  range(12):
            cnt[i].sort(key=lambda x:x[1],reverse=True)
            if cnt[i][0][1]!=0:
                count[i] = cnt[i][0][0]
        return Response({'emotions': et, 'count':count})
    else:
        return HttpResponse('noUser', status=400)


# 결과 저장하면서 그 결과 보내주기
@csrf_exempt
@api_view(['POST'])
def save(request):
    # print(request.data)
    video = request.FILES['video'].file

    user = User.objects.all().filter(username=request.data.get('username'))
    if user:

        model = model_from_json(open('./models/fer.json', 'r').read())
        model.load_weights('./models/fer.h5')
        face_haar_cascade = cv2.CascadeClassifier('./models/haarcascade_frontalface_default.xml')

        cap=cv2.VideoCapture(video.name)

        fps = cap.get(cv2.CAP_PROP_FPS)  
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = frame_count/fps

        if (duration > 10):
            duration = 10

        emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')
        emotionValues = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        cnt = 0
        begin_time = time.time()

        while(cap.isOpened()):

            ret,test_img=cap.read()# captures frame and returns boolean value and captured image
            if not ret:
                continue
            gray_img= cv2.cvtColor(test_img, cv2.COLOR_BGR2GRAY)

            faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)


            for (x,y,w,h) in faces_detected:
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
                    cnt += 1
                    for i in range(len(emotions)):
                        emotionValues[i] += predictions[0][i]
                else:
                    logging.warning("except neutral")

                predicted_emotion = emotions[max_index]

                logging.warning(predicted_emotion)
                logging.warning(max_value)
                logging.warning(emotionValues)


            # timer
            process_time = time.time() - begin_time
            if (process_time >= duration - 1):
                break
        cap.release()
        # print('cnt',cnt)
        # print('emotionValues',emotionValues)
        # 총 감정 분석해줄 영상 받기
        user = get_object_or_404(User, pk=user[0].pk)
        if cnt==0:
            emotion = Emotion.objects.create(
                userNo = user,
                mood1 = 15.0,
                mood2 = 15.0,
                mood3 = 15.0,
                mood4 = 15.0,
                mood5 = 15.0,
                mood6 = 15.0,
                mood7 = 10.0,
                option = 1
            )
        else :
            emotion = Emotion.objects.create(
                userNo = user,
                mood1 = round(emotionValues[0]*100/cnt,2),
                mood2 = round(emotionValues[1]*100/cnt,2),
                mood3 = round(emotionValues[2]*100/cnt,2),
                mood4 = round(emotionValues[3]*100/cnt,2),
                mood5 = round(emotionValues[4]*100/cnt,2),
                mood6 = round(emotionValues[5]*100/cnt,2),
                mood7 = round(emotionValues[6]*100/cnt,2),
                option = 1
            )
            
        return HttpResponse('success', status=200)
    else:
        return HttpResponse('noUser', status=400)

    
@api_view(['POST'])
@csrf_exempt
def text(request):
    # print(request.data)
    stopwords = ['의','가','이','은','들','는','좀','잘','걍','과','도','를','으로','자','에','와','한','하다']
    X_dialog = stt.X_dialog
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(X_dialog)

    threshold = 3
    total_cnt = len(tokenizer.word_index)  # 단어의 수
    rare_cnt = 0  # 등장 빈도수가 threshold보다 작은 단어의 개수를 카운트
    total_freq = 0  # 훈련 데이터의 전체 단어 빈도수 총 합
    rare_freq = 0  # 등장 빈도수가 threshold보다 작은 단어의 등장 빈도수의 총 합

    # 단어와 빈도수의 쌍(pair)을 key와 value로 받는다.
    for key, value in tokenizer.word_counts.items():
        total_freq = total_freq + value

        # 단어의 등장 빈도수가 threshold보다 작으면
        if (value < threshold):
            rare_cnt = rare_cnt + 1
            rare_freq = rare_freq + value

    vocab_size = total_cnt - rare_cnt + 2

    tokenizer = Tokenizer(vocab_size, oov_token = 'OOV')
    tokenizer.fit_on_texts(X_dialog)
    X_dialog = tokenizer.texts_to_sequences(X_dialog)

    okt = Okt()
    max_len = 30

    txt = request.data.get('text')
    emo = ''

    user = User.objects.all().filter(username=request.data.get('username'))
    if user:
        user = get_object_or_404(User, pk=user[0].pk)
        loaded_model = load_model('./models/sentence_model2.h5')
        def sentiment_predict(new_sentence):
            new_sentence = okt.morphs(new_sentence, stem=True) # 토큰화
            new_sentence = [word for word in new_sentence if not word in stopwords] # 불용어 제거
            encoded = tokenizer.texts_to_sequences([new_sentence]) # 정수 인코딩
            pad_new = pad_sequences(encoded, maxlen = max_len) # 패딩
            score = max(loaded_model.predict(pad_new)[0]) # 예측

            score_index = np.where(loaded_model.predict(pad_new)[0] == score)[0][0]
            if(score_index == 0):
                emo= '혐오'
                # print("{:.2f}% 확률로 혐오 입니다.\n".format(score*100))
            elif(score_index == 1):
                emo = '중립'
                # print("{:.2f}% 확률로 중립 입니다.\n".format(score*100))
            elif(score_index == 2):
                emo = '공포'
                # print("{:.2f}% 확률로 공포 입니다.\n".format(score*100))
            elif(score_index == 3):
                emo = '놀람'
                # print("{:.2f}% 확률로 놀람 입니다.\n".format(score*100))
            elif(score_index == 4):
                emo = '분노'
                # print("{:.2f}% 확률로 분노 입니다.\n".format(score*100))
            elif(score_index == 5):
                emo = '슬픔'
                # print("{:.2f}% 확률로 슬픔 입니다.\n".format(score*100))
            else:
                emo = '행복'
                # print("{:.2f}% 확률로 행복 입니다.\n".format(score*100))
            mood1 = round(loaded_model.predict(pad_new)[0][4]*100,2)    #angry
            mood2 = round(loaded_model.predict(pad_new)[0][0]*100,2)    #disgust
            mood3 = round(loaded_model.predict(pad_new)[0][2]*100,2)    #fear
            mood4 = round(loaded_model.predict(pad_new)[0][6]*100,2)    #happy
            mood5 = round(loaded_model.predict(pad_new)[0][5]*100,2)    #sad
            mood6 = round(loaded_model.predict(pad_new)[0][3]*100,2)    #surprise
            mood7 = round(loaded_model.predict(pad_new)[0][1]*100,2)   #neutral


            emotion = Emotion.objects.create(
                userNo = user,
                mood1 = mood1,
                mood2 = mood2,
                mood3 = mood3,
                mood4 = mood4,
                mood5 = mood5,
                mood6 = mood6,
                mood7 = mood7,
                option = 2
            )
            emotion.save()
            arr = []
            arr.append(mood1)
            arr.append(mood2)
            arr.append(mood3)
            arr.append(mood4)
            arr.append(mood5)
            arr.append(mood6)
            arr.append(mood7)
            arr2 = arr[:]
            arr.sort(reverse=True)
            idx = arr2.index(arr[0])    #  가장 높은 감정

            # 해당 감정에 맞는 질문 랜덤으로 쏘기
            ques = Question.objects.all().filter(questionNo=request.data.get('questionNo'))
            if ques:
                cnt = ques.count()
                random_index = int(random.random()*cnt)
                random_que = ques[random_index] 
                
                return random_que.question
            else:
                return ''
        que = sentiment_predict(txt)
        return Response({
                    'que' : que
                })
    else:
        return HttpResponse('noUser', status=400)



@api_view(['GET'])
def result(request):
    # print(request)
    # print(request.GET.get('username'))
    user = User.objects.all().filter(username=request.GET.get('username'))
    if user:
        emotion = Emotion.objects.all().filter(userNo=user[0].pk, option=2).order_by('-date')[:3]
        cnt=[0.0,0.0,0.0,0.0,0.0,0.0,0.0]
        for emo in emotion:
            cnt[0] += emo.mood1
            cnt[1] += emo.mood2
            cnt[2] += emo.mood3
            cnt[3] += emo.mood4
            cnt[4] += emo.mood5
            cnt[5] += emo.mood6
            cnt[6] += emo.mood7
        emotion = Emotion.objects.all().filter(userNo=user[0].pk, option=1).order_by('-date')[:1]
        cnt[0] = round((cnt[0]+ emotion[0].mood1)/4,2)
        cnt[1] = round((cnt[1]+ emotion[0].mood2)/4,2)
        cnt[2] = round((cnt[2]+ emotion[0].mood3)/4,2)
        cnt[3] = round((cnt[3]+ emotion[0].mood4)/4,2)
        cnt[4] = round((cnt[4]+ emotion[0].mood5)/4,2)
        cnt[5] = round((cnt[5]+ emotion[0].mood6)/4,2)
        cnt[6] = round((cnt[6]+ emotion[0].mood7)/4,2)
        user = get_object_or_404(User, pk=user[0].pk)
        emotion = Emotion.objects.create(
            userNo = user,
            mood1 = cnt[0],
            mood2 = cnt[1],
            mood3 = cnt[2],
            mood4 = cnt[3],
            mood5 = cnt[4],
            mood6 = cnt[5],
            mood7 = cnt[6],
            option = 3
        )
        emotion.save()
        arr = []
        idx = []
        per = []
        arr.append(cnt[0])
        arr.append(cnt[1])
        arr.append(cnt[2])
        arr.append(cnt[3])
        arr.append(cnt[4])
        arr.append(cnt[5])
        arr.append(cnt[6])
        
        arr2 = arr[:]
        arr.sort(reverse=True)
        per.append(arr[0])
        per.append(arr[1])
        per.append(arr[2])
        fr = arr2.index(arr[0])
        se = arr2.index(arr[1])
        th = arr2.index(arr[2])
        if se==fr:
            se = arr2.index(arr[1],fr+1,7)
        if th==fr or th==se:
            th = arr2.index(arr[2],se+1,7)
        idx.append(fr)
        idx.append(se)
        idx.append(th)
        emotion = [[idx[0],per[0]],[idx[1],per[1]],[idx[2],per[2]]]
        
        finalEmo = '초기값'
        num = 0
        op = -1
        if fr > se:
            th = fr
            fr = se
            se = th
            op = 1
        ##################### 2차 감정 ################################
        if(fr==0):
            if(se==1):
                finalEmo='경멸'
                num = 1
            if(se==2):
                num = 2
                finalEmo='무력함'
            if(se==3):
                num = 3
                finalEmo='당혹감'
            if(se==4):
                num = 4
                finalEmo='비통함'
            if(se==5):
                num = 5
                finalEmo='격분'
            if(se==6):
                num = 6
                finalEmo='공격성'
        if(fr==1):
            if(se==2):
                num = 7
                finalEmo='수치심'
            if(se==3):
                num = 8
                finalEmo='혼란'
            if(se==4):
                num = 9
                finalEmo='근심'
            if(se==5):
                num = 10
                finalEmo='불신'
            if(se==6):
                num = 11
                finalEmo='역겨움'
        if(fr==2):
            if(se==3):
                num = 12
                finalEmo='외경심'
            if(se==4):
                num = 13
                finalEmo='절망'
            if(se==5):
                num = 14
                finalEmo='경외'
            if(se==6):
                num = 15
                finalEmo='두려움'
        if(fr==3):
            if(se==4):
                num = 16
                finalEmo='사랑'
            if(se==5):
                num = 17
                finalEmo='설렘'
            if(se==6):
                num = 18
                finalEmo='낙관'
        if(fr==4):
            if(se==5):
                num = 19
                finalEmo='반감'
            if(se==6):
                num = 20
                finalEmo='우울함'
        if(fr==5):
            if(se==6):
                num = 21
                finalEmo='놀라움'

        if op==1:
            th = fr
            fr = se
            se = th
        final = Final.objects.create(
            userNo = user,
            moodType = num
        )
        final.save()
        # print(fr,se,num)
        fr += 1
        se += 1
        ##################### 2차 감정 ################################

        ##################### 통계 ####################################
        user = User.objects.all().filter(username=request.GET.get('username'))
        stEm = Final.objects.all().filter(userNo=user[0].pk).order_by('-date')[:1]
        statistic = ({
            'idx' : -1,
            'age' : 1,
            'gneder' : 0,
            'time' : 0
        })
        if stEm:
            gender = user[0].gender
            age = user[0].age
            time = stEm[0].date
            date_str = time.strftime("%Y-%m-%d %H:%M:%S")
            time = (str)(date_str)
            time = int(time[11:13])/3
            accounts = User.objects.all().filter(gender=gender, age=age)
            starr = [['경멸',0],['무력함',0],['당혹감',0],['비통함',0],['격분',0],['공격성',0],['수치심',0],['혼란',0],['근심',0],['불신',0],['역겨움',0],['외경심',0],['절망',0],['경외',0],['두려움',0],['사랑',0],['설렘',0],['낙관',0],['반감',0],['우울함',0],['놀라움',0]]
            for ac in accounts:
                emotions = Final.objects.all().filter(userNo=ac.pk)
                for emo in emotions:
                    tm = emo.date
                    tm = (str)(tm.strftime("%Y-%m-%d %H:%M:%S"))
                    tm = int(tm[11:13])/3
                    if int(time)!=int(tm):
                        continue
                    starr[emo.moodType-1][1]+=1
        
            starr.sort(key=lambda x:x[1],reverse=True)
            stidx = [starr[0],starr[1],starr[2],starr[3],starr[4],starr[5],starr[6],starr[7],starr[8],starr[9]]
            statistic=({
                'idx' : stidx,
                'age' : age,
                'gender' : gender,
                'time' : int(time)
                })
        ##################### 통계 ####################################
        one = 0
        two = 0
        three = 0
        music = Result.objects.all().filter(moodType=fr, resultType=1)
        cnt = music.count()
        one = int(random.random()*cnt)
        two = int(random.random()*cnt)
        if(two==one):
            while True:
                number = int(random.random()*cnt)
                if(number!=one):
                    two = number
                    break
        if(three==one or three==two):
            while True:
                number = int(random.random()*cnt)
                if(number!=one and number!=two):
                    three = number    
                    break
                    
        first_music = music[one].content 
        firstidx = first_music.index('/')
        firstsinger = first_music[:firstidx]
        firsttitle = first_music[firstidx+1:]

        second_music = music[two].content 
        secondidx = second_music.index('/')
        secondsinger = second_music[:secondidx]
        secondtitle = second_music[secondidx+1:]

        third_music = music[three].content 
        thirdidx = third_music.index('/')
        thirdsinger = third_music[:thirdidx]
        thirdtitle = third_music[thirdidx+1:]
        music = [[firstsinger,firsttitle],[secondsinger,secondtitle],[thirdsinger,thirdtitle]]
        
        tt = Result.objects.all().filter(moodType=fr, resultType=2)
        cnt = tt.count()
        random_index = int(random.random()*cnt)
        random_text = tt[random_index].content
        idx = random_text.index('-')
        text = random_text[:idx]
        where = random_text[idx+1:]
        comment = Result.objects.all().filter(moodType=num, resultType=3)
        
        reco = Result.objects.all().filter(moodType=fr, resultType=4)
        
        return Response({'emotions': emotion, 'finalEmotion': finalEmo, 'statistic' : statistic, 'text':[text,where], 'music':music, 'comment' : comment[0].content, 'reco':reco[0].content})
    else:
        return HttpResponse('noUser', status=400)


@api_view(['GET'])
def apk(request):

    return render(request, 'index.html')


@api_view(['GET'])
def qr(request):


    def gcd(a, b):
        while b!=0:
            a, b = b, a%b
        return a

    def encrypt(pk, plaintext):
        key, n = pk
        cipher = [(ord(char) ** key) % n for char in plaintext]
        return cipher

    def get_private_key(e, tot):
        k=1
        while (e*k)%tot != 1 or k == e:
            k+=1
        return k

    def get_public_key(tot):
        e=2
        while e<totient and gcd(e, totient)!=1:
            e += 1
        return e
    




    # print(request.GET.get('username'))
    username = request.GET.get('username')
    
    user = User.objects.all().filter(username=username)
    
    record = Qr.objects.all().filter(userNo=user[0].pk).order_by('-date')[:1]
    final = Final.objects.all().filter(userNo=user[0].pk).order_by('-date')[:1]
    emo = final[0].moodType
    check = 0
    send = ''
    if record :
        time = record[0].date
        date_str = time.strftime("%Y-%m-%d %H:%M:%S")
        time = (str)(date_str)
        timeY = int(time[0:4])
        timeM = int(time[5:7])
        timeD = int(time[9:10])
        timeH = int(time[11:13])

        nowT = datetime.now()
        date_str = nowT.strftime("%Y-%m-%d %H:%M:%S")
        nowT = (str)(date_str)
        nowTY = int(nowT[0:4])
        nowTM = int(nowT[5:7])
        nowTD = int(nowT[9:10])
        if timeY==nowTY and timeM==nowTM and timeD==nowTD:
            check = 1
        else :
            check = 0
    if check==0:
        m = username+'/'+str(emo)

        p = 13
        q = 23

        n = p*q

        totient = (p-1)*(q-1)

        e = get_public_key(totient)

        d = get_private_key(e, totient)

        encrypted_msg = encrypt((e,n), m)
        for i in encrypted_msg:
            if send!='':
                send = send+'/'+str(i)
            else :
                send = send+str(i)
        # send = ''.join(map(lambda x: str(x), encrypted_msg))
            
    return Response({'check': send})


@api_view(['POST'])
def mk(request):
    # print(request.data)
    username = request.data.get('username')
    # print(username)
    user = User.objects.all().filter(username=username)
    if user:
        record = Qr.objects.all().filter(userNo=user[0].pk).order_by('-date')[:1]
        check = 0
        if record :
            time = record[0].date
            date_str = time.strftime("%Y-%m-%d %H:%M:%S")
            time = (str)(date_str)
            time2 = time[0:10]
            # print(time2)
            timeY = int(time[0:4])
            timeM = int(time[5:7])
            timeD = int(time[9:10])
            timeH = int(time[11:13])
            if(timeH>14):
                timeD += 1
            nowT = datetime.now()
            date_str = nowT.strftime("%Y-%m-%d %H:%M:%S")
            nowT = (str)(date_str)
            nowT2 = nowT[0:10]
            nowTY = int(nowT[0:4])
            nowTM = int(nowT[5:7])
            nowTD = int(nowT[9:10])
            # print(time)
            # print(nowT)
            # print(timeY,timeM,timeD)
            # print(nowTY,nowTM,nowTD)
            # print(nowT)
            if timeY==nowTY and timeM==nowTM and timeD==nowTD:
                check = 1
            else:
                user = get_object_or_404(User, pk=user[0].pk)
                qr = Qr.objects.create(
                        userNo = user,
                    )
                qr.save()
        else :
            user = get_object_or_404(User, pk=user[0].pk)
            qr = Qr.objects.create(
                    userNo = user,
                )
            qr.save()
        return Response({'check': check})
    else:
        return Response({'check': 1})


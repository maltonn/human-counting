USE_CAMERA=False



import cv2
import numpy as np
from pathlib import Path
from transformers import YolosImageProcessor, YolosForObjectDetection
from PIL import Image
import torch
from collections import defaultdict

from boxmot import BoTSORT
import datetime

tracker = BoTSORT(
    model_weights=Path('osnet_x0_25_msmt17.pt'), # which ReID model to use
    device='cuda',
    fp16=False,
)

model = YolosForObjectDetection.from_pretrained('hustvl/yolos-tiny').to('cuda')
image_processor = YolosImageProcessor.from_pretrained("hustvl/yolos-tiny")

if USE_CAMERA:
    vid = cv2.VideoCapture(0) 
else:
    vid = cv2.VideoCapture("sample1.mp4") # カメラを使うときは 0

    fps = int(vid.get(cv2.CAP_PROP_FPS))

    # ビデオで最初の数秒をスキップ
    vid.set(cv2.CAP_PROP_POS_FRAMES, fps*3)

st=set()
frame_no=0
while True:
    frame_no+=1
    # カメラからフレームを取得
    ret, im = vid.read()
    if not ret:
        print("カメラから映像を取得できませんでした。")
        break
    image = Image.fromarray(im)
    width=im.shape[1]


    inputs = image_processor(images=image, return_tensors="pt").to('cuda')
    # print(inputs)
    outputs = model(**inputs)

    # model predicts bounding boxes and corresponding COCO classes
    logits = outputs.logits
    bboxes = outputs.pred_boxes


    # print results
    target_sizes = torch.tensor([image.size[::-1]])
    results = image_processor.post_process_object_detection(outputs, threshold=0.9, target_sizes=target_sizes)[0]
    dets=[]
    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        if label.item() != 1:
            continue
        box = [round(i, 2) for i in box.tolist()]
        # print(
        #     f"Detected {model.config.id2label[label.item()]} with confidence "
        #     f"{round(score.item(), 3)} at location {box}"
        # )
        dets.append([box[0], box[1], box[2], box[3], score.item(), label.item()])

        box=[int(x) for x in box]

        
        cv2.rectangle(im, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
    cv2.imshow('Human Detection', im)
    
    # 'q'キーが押された場合、ループから抜ける
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    # substitute by your object detector, output has to be N X (x, y, x, y, conf, cls)
    dets = np.array(dets)
    if(len(dets)==0):
        print(f"0 human found on frame {frame_no}",end="\r")
        continue


    tracks = tracker.update(dets, im) # --> (x, y, x, y, id, conf, cls, ind)
    # print(tracks[:,4])
    if len(tracks.shape) == 1:
        continue
    
    print(f"{len(tracks)} human found on frame {frame_no}",end="\r")

    for x,y,x2,y2,id,conf,_,_ in tracks:
        if id not in st:
            st.add(id)

            if x<width/3: #初めてのフレームINが左側
                direction=">"
            elif x>width*2/3: #右側
                direction="<"
            else:
                direction="?"

            with open("log.txt", "a") as f:
                f.write(f"{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')},{len(st)},{direction}\n")
                
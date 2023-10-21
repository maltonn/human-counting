# 人数カウント
道路とかにカメラを置いておいて、前を通った延べ人数をカウントするやつです。  
大阪大学まちかね祭の来場者数調査のために作りました。

## 注意事項
- GPU付きのパソコンで実行しないとえらいことになります

## 実行手順

1. [公式サイト](https://pytorch.org/get-started/locally/)を参考にpytorchをインストール
```
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu117  
```
2. その他もろもろのインストール
```
pip install -r requirements.txt
```

3. ソースコードの書き換え / 動画ファイルの配置  

- カメラを使う場合：ソースコード1行目を```USE_CAMERA=True```に変更
- 動画を使う場合　：sample1.mp4という名前で同階層に配置

4. 実行  
初回の起動はそれなりに時間がかかるので注意
```
python main.py
```

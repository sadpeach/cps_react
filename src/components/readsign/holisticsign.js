import React, { useRef, useEffect, useState } from "react";
import * as HolisticPose from "@mediapipe/holistic";
import { Holistic } from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import * as tf from '@tensorflow/tfjs'

import {
  drawConnectors,
  drawLandmarks,
} from '@mediapipe/drawing_utils/drawing_utils';

import extract_keypoints from "./extractkeypoints";

const ACTIONS = ['no', 'yes', 'sick', 'help', 'play', 'stop'];

export default function HolisticSign({ model }) {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [predidction, setPrediction] = useState([]);
  const [sentence, setSentence] = useState([]);
  const [sequence, setSequence] = useState([]);
  const [predictedWord, setPredictedWord] = useState([]);

  var camera = null;

  function onResults(results) {

    // console.log('result:',results);
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.segmentationMask, 0, 0,
      canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    canvasCtx.globalCompositeOperation = 'source-in';
    canvasCtx.fillStyle = '#00FF00';
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

    canvasCtx.globalCompositeOperation = 'source-over';

    drawConnectors(canvasCtx, results.poseLandmarks, HolisticPose.POSE_CONNECTIONS,
      { color: '#ff0400', lineWidth: 4 });
    drawLandmarks(canvasCtx, results.poseLandmarks,
      { color: '#ff0400', lineWidth: 2 });
    drawConnectors(canvasCtx, results.faceLandmarks, HolisticPose.FACEMESH_TESSELATION,
      { color: '#C0C0C070', lineWidth: 1 });
    drawConnectors(canvasCtx, results.leftHandLandmarks, HolisticPose.HAND_CONNECTIONS,
      { color: '#CC0000', lineWidth: 5 });
    drawLandmarks(canvasCtx, results.leftHandLandmarks,
      { color: '#00FF00', lineWidth: 2 });
    drawConnectors(canvasCtx, results.rightHandLandmarks, HolisticPose.HAND_CONNECTIONS,
      { color: '#00CC00', lineWidth: 5 });
    drawLandmarks(canvasCtx, results.rightHandLandmarks,
      { color: '#FF0000', lineWidth: 2 });
    canvasCtx.restore();

    //prediction
    const keypoints = extract_keypoints(results).arraySync();
    setSequence(oldArray => [...oldArray, keypoints]);
  }

  useEffect(() => {
    const temp = sequence.slice(-20); // get last 30 sequences

    if (temp.length == 20) {
      // console.log('fed to temp:', temp);
      // temp = tf.tensor1d(temp);
      const temp2 = tf.expandDims(temp, 0);
      // console.log('temp expand dimension:',temp2);
      // temp2.print()

      // console.log('transformed temp:',temp)
      let res = model.predict(temp2);

      const tensorData = res.dataSync();
      const tensorArray = []
      console.log('length of tensorData:', tensorData);
      for (var i = 0; i < tensorData.length; i++) {
        tensorArray.push(tensorData[i]);
      }
      // tensorArray.push(tensorData[0]);
      // tensorArray.push(tensorData[1]);
      // tensorArray.push(tensorData[2]);
      // tensorArray.push(tensorData[3]);
      // tensorArray.push(tensorData[4]);
      // tensorArray.push(tensorData[5]);
      // tensorArray.push(tensorData[6]);
      // tensorArray.push(tensorData[7]);
      // tensorArray.push(tensorData[8]);
      console.log('probability:', tensorArray);

      // const finalData = tf.tensor1d(tensorArray);
      // const outcome = finalData.argMax().print();
      var indexOfMaxValue = tensorArray.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
      console.log('index of max value:', indexOfMaxValue);
      console.log('Predicting Action:', ACTIONS[indexOfMaxValue]);

      setPredictedWord(ACTIONS[indexOfMaxValue]);
    }

  }, [sequence])



  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    holistic.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

  }, []);

  return (
    <center>
      <h2>Translated text:</h2>
      <textarea readOnly id="translatedText" style={{ fontSize: 30 }} value={predictedWord} className="border border-dark p-3 w-100"></textarea>
      <br /><br />
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: "auto",
          }}
        />{" "}
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: "auto",
          }}
        ></canvas>
      </div>
    </center>
  );
}

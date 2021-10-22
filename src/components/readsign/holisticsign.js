import React, { useRef, useEffect } from "react";
import * as HolisticPose from "@mediapipe/holistic";
import {Holistic} from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";

import {
  drawConnectors,
  drawLandmarks,
} from '@mediapipe/drawing_utils/drawing_utils';

export default function HolisticSign() {
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  var camera = null;

  function onResults(results) {
    console.log(results)
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
                    {color: '#ff0400', lineWidth: 4});
    drawLandmarks(canvasCtx, results.poseLandmarks,
                  {color: '#ff0400', lineWidth: 2});
    drawConnectors(canvasCtx, results.faceLandmarks, HolisticPose.FACEMESH_TESSELATION,
                    {color: '#C0C0C070', lineWidth: 1});
    drawConnectors(canvasCtx, results.leftHandLandmarks, HolisticPose.HAND_CONNECTIONS,
                    {color: '#CC0000', lineWidth: 5});
    drawLandmarks(canvasCtx, results.leftHandLandmarks,
                  {color: '#00FF00', lineWidth: 2});
    drawConnectors(canvasCtx, results.rightHandLandmarks,HolisticPose.HAND_CONNECTIONS,
                    {color: '#00CC00', lineWidth: 5});
    drawLandmarks(canvasCtx, results.rightHandLandmarks,
                  {color: '#FF0000', lineWidth: 2});
    canvasCtx.restore();
  }
  
  useEffect(()=>{
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
            width: 640,
            height: 480,
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
            width: 640,
            height: 480,
          }}
        ></canvas>
      </div>
    </center>
  );
}

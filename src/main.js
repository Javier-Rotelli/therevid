import "./style.css";

import ml5 from "ml5";
import p5 from "p5";
import * as Tone from "tone";

import { move, triggerAttack, volume } from "./sound.js";

document.addEventListener("DOMContentLoaded", (event) => {
  init();
});

const init = () => {
  const appElement = document.querySelector("#app");

  let handpose;
  let video;

  let hands = [];

  // Callback function for when handPose outputs data
  function gotHands(results) {
    // Save the output to the hands variable
    hands = results;
    if (hands.length === 0) {
      volume(0);
    }
    if (hands[0]) {
      move({
        x: hands[0].wrist.x / video.width,
        y: hands[0].wrist.y / video.height,
      });
    }
    if (hands[1]) {
      volume(hands[1].wrist.x / video.width);
    }
  }

  let soundPlaying = false;
  const toggleSound = () => {
    if (soundPlaying) {
      Tone.getTransport().stop();
      soundPlaying = false;
    } else {
      Tone.start();
      triggerAttack({
        x: 0,
        y: 0,
      });
      Tone.getTransport().start();
      soundPlaying = true;
    }
  };

  /**
   *
   * @param {import("p5").p5InstanceExtensions} p
   */
  const sketch = (p) => {
    console.log("Initializing p5 sketch...");

    p.setup = async () => {
      video = p.createCapture(p.VIDEO);
      handpose = await ml5.handPose({ flipHorizontal: true }, () => {
        console.log("Handpose model loaded");
        handpose.detectStart(video, gotHands);
      });
      p.createCanvas(640, 480);
      let button = p.createButton("click me");
      button.position(0, 100);

      // Call repaint() when the button is pressed.
      button.mousePressed(toggleSound);

      video.size(640, 480);
      video.hide();
    };

    p.draw = () => {
      p.push();
      p.scale(-1, 1);
      p.image(video, -p.width, 0, 0, p.height);
      p.pop();

      for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        for (let j = 0; j < hand.keypoints.length; j++) {
          let keypoint = hand.keypoints[j];
          p.fill(0, 255, 0);
          p.noStroke();
          p.circle(keypoint.x, keypoint.y, 10);
        }
      }
    };
  };

  const p5inst = new p5(sketch, appElement);
};

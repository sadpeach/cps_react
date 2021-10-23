import * as tf from '@tensorflow/tfjs'

export default function extract_keypoints(results) {
    // console.log('result:',results);
    var pose = [];
    var face = [];
    var rh = []
    var lh = [];
    var flatten_pose = null;
    var flatten_face = null;
    var flatten_lh = null;
    var flatten_rh = null

    //pose
    if (results.poseLandmarks) {
        for (let res in results.poseLandmarks) {
            // pose = window.nj.array([results.poseLandmarks[res].x, results.poseLandmarks[res].y, results.poseLandmarks[res].z,results.poseLandmarks[res].visibility]).flatten();
            // pose.push(tf.tensor([results.poseLandmarks[res].x, results.poseLandmarks[res].y, results.poseLandmarks[res].z, results.poseLandmarks[res].visibility]));
            pose.push([results.poseLandmarks[res].x, results.poseLandmarks[res].y, results.poseLandmarks[res].z, results.poseLandmarks[res].visibility]);
        }
        flatten_pose = tf.util.flatten(pose);
    }
    else {
        flatten_pose = tf.zeros([132]).flatten();
        //   pose = window.nj.zeros(33 * 4);
    }

    //face
    if (results.faceLandmarks) {
        for (let res in results.faceLandmarks) {
            // face = window.nj.array([results.faceLandmarks[res].x, results.faceLandmarks[res].y, results.faceLandmarks[res].z,results.faceLandmarks[res].visibility]).flatten();
            // face.push(tf.tensor([results.faceLandmarks[res].x, results.faceLandmarks[res].y, results.faceLandmarks[res].z, results.faceLandmarks[res].visibility]))
            face.push([results.faceLandmarks[res].x, results.faceLandmarks[res].y, results.faceLandmarks[res].z]);
        }
        flatten_face = tf.util.flatten(face);
    }
    else {
        flatten_face = tf.zeros([1404]);
        //   face = window.nj.zeros(468 * 3);
    }

    //left-hand
    if (results.leftHandLandmarks) {
        for (let res in results.leftHandLandmarks) {
            // lh = window.nj.array([results.leftHandLandmarks[res].x, results.leftHandLandmarks[res].y, results.leftHandLandmarks[res].z,results.leftHandLandmarks[res].visibility]).flatten();
            // lh.push(tf.tensor([results.leftHandLandmarks[res].x, results.leftHandLandmarks[res].y, results.leftHandLandmarks[res].z, results.leftHandLandmarks[res].visibility]));
            lh.push([results.leftHandLandmarks[res].x, results.leftHandLandmarks[res].y, results.leftHandLandmarks[res].z]);
        }
        flatten_lh = tf.util.flatten(lh);
    }
    else {

        // flatten_lh = window.nj.zeros(21 * 3).flatten; // 1d array : len 63
        flatten_lh = tf.zeros([63]);
    }

    //right-hand
    if (results.right_hand_landmarks) {

        for (let res in results.rightHandLandmarks) {
            // rh =  window.nj.array([results.rightHandLandmarks[res].x, results.rightHandLandmarks[res].y, results.rightHandLandmarks[res].z,results.rightHandLandmarks[res].visibility]).flatten();
            // rh.push(tf.tensor([results.rightHandLandmarks[res].x, results.rightHandLandmarks[res].y, results.rightHandLandmarks[res].z, results.rightHandLandmarks[res].visibility]));
            rh.push([results.rightHandLandmarks[res].x, results.rightHandLandmarks[res].y, results.rightHandLandmarks[res].z]);
        }
        flatten_rh = tf.util.flatten(rh);
    }
    else {

        //   rh = window.nj.zeros(21 * 3);
        flatten_rh =tf.zeros([63]);
    }

    // console.log('after flatten [rh]:',flatten_rh.length);
    // console.log('after flatten [pose]:',flatten_pose.length);
    // console.log('after flatten [face]:',flatten_face.length);
    // console.log('after flatten [lh]:',flatten_lh.length);

    // console.log('======================ACTUAL VALUES==================')
    // console.log('after flatten [rh]:',flatten_rh);
    // console.log('after flatten [pose]:',flatten_pose);
    // console.log('after flatten [face]:',flatten_face);
    // console.log('after flatten [lh]:',flatten_lh);



    // console.log('check:', flatten_pose, flatten_face, flatten_rh, flatten_lf);

    const final = tf.concat([flatten_pose, flatten_face, flatten_rh, flatten_lh], 0)
    // console.log('check final size:', final.shape);
    return final
}
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import PoseDetectionCamera from '../../Components/cameraComponent'; // Adjust path as necessary
import { loadModel, predict } from '../../offline_model/lat_pull_down_class/Model_Loader_Lat_Pull_Down';
import * as tf from '@tensorflow/tfjs';
import { calculateAngle, calculateDistance_2 } from '../supporting_methods/angle';

const LatPullDown_Model = () => {
    const [poseType, setPose] = useState('normal');
    const [excercisePose, setExcercisePose] = useState(NaN);
    const [prediction, setPrediction] = useState(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [time, setTime] = useState(0);
    const [workoutStarted, setWorkoutStarted] = useState(false); // State to track if workout has started
    const timerRef = useRef(null);
    const repPoseRef = useRef(null); 
    const poseFrameCountRef = useRef(0);
    const repCountRef = useRef(0);

    useEffect(() => {
        const loadModelAsync = async () => {
            try {
                await loadModel();
                setIsModelLoaded(true);
            } catch (error) {
                console.error("Model failed to load:", error);
            }
        };
  
        loadModelAsync();
    }, []);

    useEffect(() => {
        if (poseType === 'correct') {
            if (!timerRef.current) {
                timerRef.current = setInterval(() => {
                    setTime(prevTime => prevTime + 1);
                }, 1000);
            }
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [poseType]);

    const inputTensorData = (keypoints) => {
        const nose = keypoints.find((k) => k.name === 'nose');

        const leftShoulder = keypoints.find((k) => k.name === 'left_shoulder');
        const leftHip = keypoints.find((k) => k.name === 'left_hip');
        const leftKnee = keypoints.find((k) => k.name === 'left_knee');
        const leftElbow = keypoints.find((k) => k.name === 'left_elbow');
        const leftWrist = keypoints.find((k) => k.name === 'left_wrist');
        
        const rightShoulder = keypoints.find((k) => k.name === 'right_shoulder');
        const rightHip = keypoints.find((k) => k.name === 'right_hip');
        const rightKnee = keypoints.find((k) => k.name === 'right_knee');
        const rightElbow = keypoints.find((k) => k.name === 'right_elbow');
        const rightWrist = keypoints.find((k) => k.name === 'right_wrist');
      
        let leftHipAngle = null;
        let rightHipAngle = null;
        let leftShoulderAngle = null;
        let rightShoulderAngle = null;
        let leftElbowAngle = null;
        let rightElbowAngle = null;
        
        let torso_straightness = null;
        let arms_straightness = null;

        if (leftShoulder && leftHip && leftKnee) {
            leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
        }   
        if (rightShoulder && rightHip && rightKnee) {
            rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
        }
        if (leftHip && leftShoulder && leftElbow) {
            leftShoulderAngle = calculateAngle(leftHip, leftShoulder, leftElbow);
        }
        if (rightHip && rightShoulder && rightElbow) {
            rightShoulderAngle = calculateAngle(rightHip, rightShoulder, rightElbow);
        }
        if (leftShoulder && leftElbow && leftWrist) {
            leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        }
        if (rightShoulder && rightElbow && rightWrist) {
            rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
        }

        let wrist_x = (leftWrist.x + rightWrist.x) / 2;
        let wrist_y = (leftWrist.y + rightWrist.y) / 2;
        let hip_x = (leftHip.x + rightHip.x) / 2;
        let hip_y = (leftHip.y + rightHip.y) / 2;
        let shoulder_x = (leftShoulder.x + rightShoulder.x) / 2;
        let shoulder_y = (leftShoulder.y + rightShoulder.y) / 2;

        torso_straightness = (shoulder_y - hip_y) / calculateDistance_2(shoulder_x, shoulder_y, hip_x, hip_y);
        arms_straightness = (wrist_y - shoulder_y) / calculateDistance_2(wrist_x, wrist_y, shoulder_x, shoulder_y);
     
        return [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle, leftHipAngle, rightHipAngle, torso_straightness, arms_straightness];
    };

    const countReps = async (pose) => {
        if (pose === 'correct_low' || pose === 'correct_high') {
            console.log(poseFrameCountRef.current);
            if (pose === repPoseRef.current) {
                poseFrameCountRef.current = 0;
            } else {
                poseFrameCountRef.current += 1;
                if (poseFrameCountRef.current >= 5) {
                    if (repPoseRef.current === 'correct_high' && pose === 'correct_low') {
                        repCountRef.current += 1;
                    }
                    repPoseRef.current = pose;
                }
            }
        }
    };

    const handleLandmarksDetected = async (keypoints) => {
        try {
            const [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle, leftHipAngle, rightHipAngle, torso_straightness, arms_straightness] = inputTensorData(keypoints);
            const inputArray = [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle, leftHipAngle, rightHipAngle, torso_straightness, arms_straightness];
            const inputTensor = tf.tensor2d([inputArray], [1, inputArray.length]);
            const result = await predict(inputTensor);
            setPrediction(result);

            let maxIndex = result.indexOf(Math.max(...result));
            let pose;

            if (maxIndex === 1) {
                pose = 'correct_low';
                setExcercisePose(pose);
                setPose('correct');
            } else if (maxIndex === 0) {
                pose = 'correct_high';
                setExcercisePose(pose);
                setPose('correct');
            } else if (maxIndex === 2) {
                pose = 'incorrect';
                setExcercisePose(pose);
                setPose('incorrect');
            } else if (maxIndex === 3) {
                pose = 'random';
                setExcercisePose(pose);
                setPose('random');
            }

            countReps(pose);

        } catch (error) {
            console.error("Error during prediction:", error);
        }
    };

    if (!isModelLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading model...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {!workoutStarted ? (
                <View style={styles.startContainer}>
                    <Button title="Start Workout" onPress={() => setWorkoutStarted(true)} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <PoseDetectionCamera onLandmarksDetected={handleLandmarksDetected} poseType={poseType} />
                    <View style={{ padding: 10 }}>
                        {excercisePose === 'correct_low' && (<View style={styles.alertBoxCorrect}><Text style={styles.alertText}>Correct_LOW</Text></View>)}
                        {excercisePose === 'correct_high' && (<View style={styles.alertBoxCorrect}><Text style={styles.alertText}>Correct_HIGH</Text></View>)}
                        {excercisePose === 'incorrect' && (<View style={styles.alertBoxIncorrect}><Text style={styles.alertText}>Incorrect</Text></View>)}
                        <Text style={styles.repText}>Reps: {repCountRef.current}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    startContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBoxCorrect: {
        backgroundColor: 'lightgreen',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    alertBoxIncorrect: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    alertText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    repText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LatPullDown_Model;

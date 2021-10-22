import React, { useRef, useEffect } from "react";
import axios from 'axios';

export default function ToSpeech() {

    const options = {
    method: 'GET',
    url: 'https://voicerss-text-to-speech.p.rapidapi.com/',
    params: {
        key: '193aca849a14479ebbda91feae7b0ab1',
        src: 'Hello, world!',
        hl: 'en-us',
        r: '0',
        c: 'mp3',
        f: '8khz_8bit_mono'
    },
    headers: {
        'x-rapidapi-host': 'voicerss-text-to-speech.p.rapidapi.com',
        'x-rapidapi-key': '28ab661fc5msh2bc6f0bdc61fb9fp19408ajsnb648ebb35da1'
    }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });

}
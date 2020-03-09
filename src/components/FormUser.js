import React, { useState } from 'react';
import axios from 'axios';
import { ClipLoader } from "react-spinners";
import { css } from "@emotion/core";
import './style.css';



export function FormUser() {
    let tweetData = [
        "I will be making a major statement from the @WhiteHouse upon my return to D.C. Time and date to be set.",
        "Just arrived at #ASEAN50 in the Philippines for my final stop with World Leaders. Will lead to FAIR TRADE DEALS, un… https://t.co/ExRBdQnJru",
        "After my tour of Asia, all Countries dealing with us on TRADE know that the rules have changed. The United States h… https://t.co/MoMNa1MUI3",
        "The United States is prepared to work with each of the leaders in this room today to achieve mutually beneficial co… https://t.co/6hY41gFM5i",
        "I am leaving China for #APEC2017 in Vietnam. @FLOTUS Melania is staying behind to see the zoo, and of course, the G… https://t.co/j2kDjWvnsj",
        "Merci au premier ministre japonais @AbeShinzo pour la rencontre productive sur la paix, la sécurité et le commerce… https://t.co/y2cVSH3dMF",
        "RT @SeamusORegan: Aujourd’hui, il y a 100 ans, de terminait une de nos batailles les plus sanglantes: Passchendaele. Nous nous souvenons…",
        "#TBT to a backpacking trip in Vietnam many years ago… my thanks to the Canadian Embassy for pulling out the old gue… https://t.co/hnKgkdTZik",
        "Heureux 150e anniversaire à Marie Curie! Découvrez la vie et l’œuvre de cette pionnière. #FemmesEnSTIM https://t.co/K4LTAsYz6F",
        "Merci, Filippo, de votre collaboration, de votre travail entourant la crise au Myanmar et de votre aide aux plus vu… https://t.co/Zf2Y2J7RIm"
    ]

    const tweets_test = tweetData;
    const test_tweet = tweets_test[Math.floor(Math.random() * tweets_test.length)];
    
    const [countUser, setUserCount] = useState(0);
    const [countMachine, setUserMachine] = useState(0);
    const [scoreMachine, setMachineScore] = useState();
    const [machineAnswer, setMachineAnswer] = useState();
    const [messageUser, setTweet] = useState();
    const [error, setError] = useState();
    const [userChoice, setUserChoice] = useState();
    const [choiceTrump, setChoiceTrump] = useState(null);
    const [choiceTrudeau, setChoiceTrudeau] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tweetTest, setTweetTest] = useState(test_tweet);



    const override = css`
        display: block;
        margin: 0 auto;
        border-color: #11ABB0;
        padding-top: 20px;
        `;

    function renderTweet(){
        const tweets_test = tweetData;
        const test_tweet = tweets_test[Math.floor(Math.random() * tweets_test.length)];
        setTweetTest(test_tweet);
    }

    function handleClick(e) {
        e.preventDefault();
        setLoading(true);
        
            setMachineAnswer();
            var tweet = tweetTest;
            var user_choice = userChoice;
            var data = {
                "tweet": tweet,
                "user_choice": user_choice
            }
            console.log(data)
            axios({
                method: 'POST',
                url: 'https://api-trump-vs-trudeau.herokuapp.com/tweet',
                headers: {
                    'Access-Control-Allow-Origin': 'https://api-trump-vs-trudeau.herokuapp.com/',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Crecenterdentials': true,
                    'Access-Control-Max-Age': '86400',
                    'Access-Control-Allow-Headers':
                        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
                },
                data: data
            })
                .then((res) => {
                    console.log(res);
                    var response = res.data.user_answer;
                    var response_machine = res.data.machine_answer;
                    var response_score = res.data.linear_svc_score;
                    var machine_response = res.data.message;
                    if (response === true) {
                        setUserCount(countUser + 1);
                        setMachineScore(response_score);
                        setMachineAnswer(machine_response);
                        setLoading(false);
                        setChoiceTrudeau(false);
                        setChoiceTrump(false);
                        renderTweet();
                       
                    }
                    if (response_machine === true) {
                        setUserMachine(countMachine + 1);
                        setMachineScore(response_score);
                        setMachineAnswer(machine_response);
                        setLoading(false);
                        setChoiceTrudeau(false);
                        setChoiceTrump(false);
                        renderTweet()
                    }

                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                })

        

    }

    function checkTheCheckBox(e) {
        var choice = e;
        if (choice === 'trump') {
            setChoiceTrump(true);
            setUserChoice('Donald J. Trump');
        }
        if (choice === 'trudeau') {
            setChoiceTrudeau(true);
            setUserChoice('Justin Trudeau');
        }

    }

    function resetStatus() {
        setChoiceTrudeau(false);
        setChoiceTrump(false);
        setUserChoice('');

    }

    function renderButton() {
        if (loading === false) {
            return (
                <button className="buttonSend" onClick={handleClick}>
                    Send
                </button>
            )
        }
        else {
            return(
                <div style={{ justifyContent: "center", paddingTop: 30 }}>
                    <ClipLoader
                        css={override}
                        size={35}
                        //size={"150px"} this also works
                        color={"#123abc"}
                        loading={loading}
                    />
                </div>
            )
            
        }
    }

    return (
        <div className="div container">
            <h3>Test if tweet is from Trump or Trudeau</h3>
            <div className="card">
                <p style={{ color: "black", fontSize: "12px", textAlign: "center", paddingTop: "5px" }}>{tweetTest}</p>
            </div>
            <p>{error}</p>
            <div className="div button">
                <button className="buttonSubmit" disabled={choiceTrudeau} value="trump" onClick={e => checkTheCheckBox(e.target.value)}>Trump</button>
                <div className="divider"/>
                <button className="buttonSubmit" disabled={choiceTrump} value="trudeau" onClick={e => checkTheCheckBox(e.target.value)}>Trudeau</button>
                
            </div>
            
            <div className="div reset">
                <a className="reset link" href="#" onClick={(e) => resetStatus()}>Reset Status</a>
            </div>

            <div>
                <p>LinearSVC Score: {scoreMachine}</p>
                <p>User choice: {userChoice}</p>  
            </div>

            <div>
                <p> {machineAnswer} </p>
                
            </div>
            <div className="div answer">
                <p style={{color: "#008000"}}>User: {countUser} </p>
                <div className="divider"/>
                <p>
                    vs 
                </p>
                <div className="divider" />
                <p style={{color: "#ff0000"}}>Machine: {countMachine}</p>   
            </div>
           
            {renderButton()}

        </div>
    )
}
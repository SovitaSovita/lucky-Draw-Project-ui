import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { get_fake_winner, get_list, insert_winner } from "../redux/service/TableListService";
import { notifyError } from "../redux/Constants";

import soundEffect from '../assets/sound/goodresult-82807.mp3'
import moto from '../assets/img/motos.png'
import logo from '../assets/img/frontend/logo.png'


import Confetti from "./Confetti";
import { get_winner } from "../redux/service/WinnerService";
import { setFake, setWinner } from "../redux/slice/ListSlice";
import { useDispatch } from "react-redux";
import Spinners from "./Spinners";


function RandomPicker() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentChoice, setCurrentChoice] = useState("");
  const [currentChoiceNum, setCurrentChoiceNum] = useState("");

  const [winnerName, setWinnerName] = useState("");
  const [winnerNumber, setWinnerNumber] = useState("")

  const [isWinner, setIsWinner] = useState(false)
  const intervalDuration = 25;
  const duration = 5500;
  let interval = null;
  let intervalNum = null;
  let fakeAtIndex = 6;

  const [items, setItems] = useState([])
  const [playSound, setPlaySound] = useState(false);
  const dispatch = useDispatch()

  const fakeWinner = useSelector((state) => state.allList.fakeWinner);

  let fakeWinnerConvert = {
    dateOfOrder: fakeWinner?.dateOfOrder,
    randomCustomer: fakeWinner?.name,
    orderNo: fakeWinner?.orderNo,
    phoneNumber: fakeWinner?.phoneNumber,
  }

  const winner = useSelector((state) => state?.allList.winnerList)

  useEffect(() => {
    getWinner()
  }, [])

  useEffect(() => {
    get_list()
      .then((res) => {
        if (res?.data && res.data?.payload) {
          const nameList = res.data?.payload.map((data) => {
            return data;
          });
          setItems(nameList);
        }
      })
      .catch((error) => {
        console.error("Error fetching list data:", error);
      });
  }, []);


  const isRunningRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false)

  const start = (newItems) => {


    setIsWinner(false);
    interval = setInterval(setChoice, intervalDuration);
    intervalNum = setInterval(setChoiceNumber, intervalDuration);

    setIsRunning(true);
    isRunningRef.current = true;

    setTimeout(() => {
      if (isRunningRef.current) {
        const choice = newItems[Math.floor(Math.random() * newItems?.length)];
        let formWinnerInfo = {
          randomCustomer: choice.name,
          phoneNumber: choice.phoneNumber,
          dateOfOrder: choice.dateOfOrder,
          orderNo: choice.orderNo
        }
        setIsWinner(true)

        if (winner?.length == fakeAtIndex && fakeWinner !== null) {
          setWinnerName(fakeWinnerConvert?.randomCustomer)
          setWinnerNumber(fakeWinnerConvert?.phoneNumber)

          insert_winner(fakeWinnerConvert).then((res) => {
            get_list().then((res) => {
              setItems(res.data?.payload)
              stop();
            })
            getWinner()
          })
        }
        else {
          setWinnerName(choice.name)
          setWinnerNumber(choice.phoneNumber)

          insert_winner(formWinnerInfo).then((res) => {
            get_list().then((res) => {
              setItems(res.data?.payload)
              stop();
            })
            getWinner()
          })
        }

        setPlaySound(true)
        // openModal()
      }
    }, duration);
    setPlaySound(false)
  };

  const getWinner = () => {
    setIsLoading(true)
    get_winner().then((res) => {
      dispatch(setWinner(res?.data?.payload))
      setIsLoading(false)
    });
  }

  const stop = () => {
    clearInterval(interval);
    clearInterval(intervalNum);
    setIsRunning(false);
  };

  const reset = () => {
    clearInterval(interval);
    setIsRunning(false);
    setCurrentChoice("");
  };

  const pickChoice = () => {
    const choice = items[Math.floor(Math.random() * items?.length)];
    return choice;
  };

  const setChoice = () => {
    setCurrentChoice(pickChoice().name);
  };
  const setChoiceNumber = () => {
    setCurrentChoiceNum(pickChoice().phoneNumber);
  };

  const choiceContent = currentChoice?.trim().length > 0 ? currentChoice : " ";
  const choiceContentNum = currentChoiceNum?.trim().length > 0 ? currentChoiceNum : " ";

  return (
    <>
      <div className="main-font-end bg-cover bg-bottom bg-hero-front">
        {
          isWinner ? <Confetti /> : null
        }
        {playSound && (
          <audio autoPlay>
            <source src={soundEffect} type="audio/mpeg" />
          </audio>
        )}

        <div className="main_draw_box">
          <img src={moto} alt="" className="object-cover w-full h-full" />
        </div>

        <div className="flex justify-between items-center w-[480px] fixed">
          <div className="font-bold text-4xl line-clamp-1">
            {isWinner ? winnerName : choiceContent}
          </div>

          <div className="font-bold text-2xl">
            {isWinner ? winnerNumber : choiceContentNum}
          </div>
        </div>

        {/* Button Draw */}

        {isRunning ? null : (
          <div class="RandomPicker__controls rounded-xl mt-10 bg-gradient-to-t from-red-weight to-red-light p-1.5 shadow cursor-pointer"
            onClick={items.length <= 0 ? null : () => { start(items) }}
          >
            <div class="flex h-full w-full items-center justify-center rounded-lg bg-white hover:bg-slate-200 back px-12 shadow border py-2 font-extrabold text-2xl">
              Draw
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="absolute bottom-4 mt-4 mr-4">
          <div className="w-28">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="absolute right-5 bottom-5 text-white text-lg width_winner w-[21%]">
          <ul className="p-6 bg-black-low border-2 border-red-weight">
            <li className="text-brand-red text-border text-3xl mb-2 font-bold italic">Watches Winner</li>
            {
              winner?.slice(0, 5).map((items, index) => (
                <li key={items.no} className="flex justify-between font-bold">
                  <div>{index + 1}. {items.name}</div>
                  <div>{items.phoneNumber}</div>
                </li>
              ))
            }
            {isLoading && winner.length < 5 && (
              <li className="flex justify-between font-bold">
                <Spinners />
                <Spinners />
              </li>
            )}
            <li className="text-brand-red text-border text-3xl mt-3 mb-2 font-bold italic">Vespa Winner</li>
            {
              winner?.slice(5, 7).map((items, index) => (
                <li key={items.no} className="flex justify-between font-bold">
                  <div>{index + 6}. {items.name}</div>
                  <div>{items.phoneNumber}</div>
                </li>
              ))
            }
            {isLoading && (winner.length >= 5  && winner.length <= 6) && (
              <li className="flex justify-between font-bold">
                <Spinners />
                <Spinners />
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* <CongratulationPopUp isOpen={isOpen} closeModal={closeModal}/> */}
    </>
  );
}

RandomPicker.propTypes = {
  items: PropTypes.array,
  duration: PropTypes.number,
};

export default RandomPicker;

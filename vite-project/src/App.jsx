import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faStopwatch, faGraduationCap, faStar, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'


function App() {
  const [data, setallData] = useState([]); // all data
  const [block, setBlock] = useState([]); // 1 question and 3 answers
  const [question, setQuestion] = useState("");
  const [idQuest, setIdQuest] = useState(1); // question Id
  const [display, setDisplay] = useState(true);
  const [answers, setAnswers] = useState([]); // all answers
  const [target, setTarget] = useState(); // the good answer of the question
  const [countGoodAnswer, setCountGoodAnswer] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // selected answer
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false); // whether user answered correctly
  const [finish, setfinish] = useState(true);
  const [UserName, setUserName] = useState("");
  const [listUsers, setListUsers] = useState([]);
  const [count, setCount] = useState(30);



  async function LoadData() {
    try {
      let data = await fetch("./data/questions.json");
      let resp = await data.json();
      setallData(resp);
      let users = JSON.parse(localStorage.getItem("users")) || [];
      setListUsers(users); // set list of users from localStorage
      UpdateSets();
    } catch (error) {
      console.error(error);
    }
  }
  function localStorageUser() {
    let users = JSON.parse(localStorage.getItem("users")) || []; // retrieve existing users or initialize empty array
    let user = { name: UserName, score: countGoodAnswer }; // create new user object
    users.push(user); // add new user object to array
    localStorage.setItem("users", JSON.stringify(users)); // store updated array in local storage

  }


  function retry() {
    document.location.reload()
    setCountGoodAnswer(0);

  }
  function numRandom() {
    let a = Math.floor(Math.random() * 30) + 1;
    return a;
  }

  function UpdateSets() {
    let a = numRandom()
    setBlock(data[a]);
    setQuestion(data[a]?.question);
    setAnswers(data[a]?.options);
    setTarget(data[a]?.answer);
    setSelectedAnswer(null); // clear selected answer when question changes
    setAnsweredCorrectly(false); // reset answeredCorrectly when question changes
  }

  function next() {
    if (idQuest > 4) {
      setfinish(!finish)
      localStorageUser()
    }
    setIdQuest(idQuest + 1);
    setSelectedAnswer(null); // clear selected answer when moving to next question
  }

  function show() {
    if (UserName != undefined && UserName != "") {
      setDisplay(!display);
    }
    else {
      alert("enter a username")
    }
  }

  function handleItemClick(event) {
    setAnsweredCorrectly(true);
    if (answeredCorrectly) return; // do nothing if user has already answered correctly

    const clickedValue = event.target;
    console.log(`Clicked value: ${clickedValue.innerHTML}`);
    setSelectedAnswer(clickedValue); // update selected answer
    if (target === clickedValue.innerHTML) {
      setCountGoodAnswer(countGoodAnswer + 1);
      clickedValue.style.backgroundColor = "green";
    } else {
      clickedValue.style.backgroundColor = "red";
    }
  }

  useEffect(() => {
    LoadData();
  }, [idQuest, display]);

  useEffect(() => {
    if (selectedAnswer) {
      // clear selected answer's color when question changes or "next" button is clicked
      return () => {
        selectedAnswer.style.backgroundColor = "";
      };
    }
  }, [idQuest, selectedAnswer]);

  useEffect(() => {
    if (count == 0) {
      next();
      setCount(30)
    }
    const timer =
      count > 0 && setInterval(() => setCount(count - 1), 1000);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <>
      <div className="quiz-container">
        {
          finish ?
            <div className="all">
              <h1 style={{ color: 'white' }}>Quizz <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '40', color: '#f2dc23' }} /></h1>
              {display ? (
                <fieldset>
                  <div className="ready">
                    <h1>Ready to start ? <FontAwesomeIcon icon={faStopwatch} /></h1>
                    <div className="input" onChange={(e) => setUserName(e.target.value)}>
                      Name :
                      <input type="text" />
                    </div>
                    <br />
                    <div className="btn">
                      <button onClick={show}><FontAwesomeIcon icon={faCheck} /></button>
                      <button><FontAwesomeIcon icon={faXmark} /></button>
                    </div>
                  </div>
                </fieldset>
              ) : (
                <div>
                  <div style={{ backgroundColor: 'white', maxWidth: '647px', borderRadius: '4px', margin: 'auto' }}>
                    <div className="details">
                      <p>Questions : <br />{idQuest}/5</p>
                      <p>Score : <br />{countGoodAnswer}/5</p>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faStopwatch} style={{ fontSize: '20' }} />
                      {count}
                    </div>
                  </div>
                  <fieldset>
                    <div className="ctr">
                      {<h5>{question}</h5>}
                      <nav>
                        <ul>
                          {answers?.map((answer, index) => (
                            <li
                              key={index}
                              onClick={handleItemClick}
                              className={selectedAnswer === answer ? "selected" : ""}
                            >
                              {answer}
                            </li>
                          ))}
                        </ul>
                      </nav>
                      <button onClick={next}>next</button>
                    </div>
                  </fieldset>
                </div>
              )}
            </div>
            :
            <div className="finish">
              <h1 style={{ color: 'white' }}>Your Scores <FontAwesomeIcon icon={faStar} style={{ color: 'yellow' }} /> </h1>
              <h2>Your Score : {countGoodAnswer}/5 !!</h2>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {listUsers.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <br />
              <button onClick={retry}>Retry <FontAwesomeIcon icon={faRotateRight} /></button>
            </div>
        }
      </div>
    </>
  );
}

export default App;

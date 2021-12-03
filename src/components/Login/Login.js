import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../context/auth-context";
import Input from "../UI/Input/Input";

// tuhle funkci si muzeme nadefinovat mimo Login komponentu, protoze
// ta nebude pouzivat zadna data, ktera budou generovana v Login komponente.
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  /*
VE VSECH TECH NASLEDUJICICH USESTATE DELAME CHYBU - VYHODNOCUJEME NEJAKY STATE POMOCI JINYCH STATU,
TO JE VIOLATING USESTATE A MUZE TO VEST K CHYBAM.
V TAKOVYCH PRIPADECH, KDY NEJAKY STATE ZAVISI NA JINYCH STATECH, JE VYHODNE POUZIT USE REDUCER,
COZ JE KOMPLEXNEJSI VERZE USESTATE.
Kazdopadne useState je hlavni state management tool. Je dobry pro nezavisla data a jednoduche state updaty.
UseReducer se hodi pro komplexnejsi priklady, napr pokud pracujeme s provazanymi daty/states a pro komplexnejsi state updaty.
*/

  //const [enteredEmail, setEnteredEmail] = useState("");
  //const [emailIsValid, setEmailIsValid] = useState();
  //const [enteredPassword, setEnteredPassword] = useState("");
  //const [passwordIsValid, setPasswordIsValid] = useState();

  const authCtx = useContext(AuthContext);

  // tohle delame kvuli te focusovaci funkci.
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });

  //-------------------------------------------------------------------------------
  /* UKAZKOVY USE EFFECT
  useEffect(() => {
    console.log('effect running')
    return() => {
      console.log(''effect cleanup') // tahle clean up funkce bezi pokazde kdyz se spusti useEffect, ale ne pri prvnim renderu
    }
  }, [enteredPassword]);
  */
  // pokud jen useEffect(() => {}), tak se to spousti pri kazde zmene.
  // pokud jen useEffect(() => {}, []), tak se to spusti jen jednou
  //-------------------------------------------------------------------------------

  // TAKHLE JSME ZKOMBINOVALI useEffect A useState, resp UseReducer (USEEEFFECT JSME POUZILI NA OVERENI FORMISVALID)

  // do techto const si uschovame property isValid tech objektu emailState a passwordState (jde o destructuring objektu)
  // a priradime jim alias (to je to za dvojteckou), protoze se jinak jmenujou stejne ty property
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    // pridame setTimeout, aby se to spoustelo jen tehdy, kdyz uzivatel prestane na chvili psat,
    // a ne pri kazdem key stroku. je ale potreba pridat i clean up function, aby bezel vzdy jen jeden setTimeout.
    const identifier = setTimeout(() => {
      console.log("Checking form validity");
      setFormIsValid(
        //enteredEmail.includes("@") && enteredPassword.trim().length > 6 // takhle to bylo pro variantu s useState
        emailState.isValid && passwordState.isValid
      );
    }, 500);

    return () => {
      // clean up function before useEffect runs the setTimeout (a setFotmIsValid) znovu.
      console.log("cleanup");
      clearTimeout(identifier); // vycistime si Timeout predtim nez se nastavi novy.
    };
  }, [emailIsValid, passwordIsValid]); // ten useEffect chceme nechat bezet jen kdyz se zmeni valid state a ne value. Nemusime delat destructuring, slo by zapsat i jako [someObject.someProperty].
  //Ale nemelo by tam byt [someObject], protoze pak to pobezi vzdycky kdyz se zmeni kterakoliv property, ne jen ta jedna konkretni, co nas zajima.
  //}, [enteredEmail, enteredPassword]); // (tohle byla verze pro useState). do useeefectu musime dat nejake dependency, protoze jinak se to nikdy nenastavi na formIsValid.
  // do dependency davame vsechny veci, ktere by se mohly zmenit kdyz se nase nebo parent component re-renderuje.
  /* 
  Kdyz budu psat hodne rychle, tak uvidim v consoli jen cleanup. jak se zastavim, tak uvidim i checking form validity.
  To je vyhodne, protoze nebudeme odesilat x bambilionu https requests (pri kazdem key stroku), ale jen jak se na chvili zastavime.
  */
  //-------------------------------------------------------------------------------

  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value }); // to val je nas payload. (payload = uzitecne zatizeni), dispatch = odeslat
    //setFormIsValid(event.target.value.includes("@") && passwordState.isValid); // tohle vyresime pomoci useEffect

    /* 
    //Takhle to bylo bez useEffectu plus s pouzitim useState.
    setEnteredEmail(event.target.value);
    setFormIsValid(
      event.target.value.includes('@') && enteredPassword.trim().length > 6
    );
    */
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
    //setFormIsValid(emailState.isValid && event.target.value.trim().length > 6); // tohle vyresime pomoci useEffect

    /*
    Takhle to bylo bez useEffectu plus s pouzitim useState.
    setEnteredPassword(event.target.value);
    setFormIsValid(
      event.target.value.trim().length > 6 && enteredEmail.includes('@')
    );
    */
  };

  const validateEmailHandler = () => {
    /* takhle to bylo pomoci useState
    setEmailIsValid(enteredEmail.includes("@"));
    */

    // takhle pomoci useReducer:
    dispatchEmail({ type: "INPUT_BLUR" });
  };

  const validatePasswordHandler = () => {
    // pomoci useReducer:
    dispatchPassword({ type: "INPUT_BLUR" });

    /* takhle to bylo pomoci useState
    setPasswordIsValid(enteredPassword.trim().length > 6);
    */
  };

  const submitHandler = (event) => {
    event.preventDefault();
    // pred pouzitim useReducer bylo:  props.onLogin(enteredEmail, enteredPassword);
    // pred pouzitim Contextu bylo: props.onLogin(emailState.value, passwordState.value);

    // Ted budeme chtit pouzit useRef na Input. Button bude clickable uz od zacatku (predtim to bylo tak,
    // ze dokud uzivatel nazadal prihlasovaci udaje v espravnem formatu, tak byl button disabled). A tim,
    // jak bude clickable od acatku, tak my pak chceme aby react zameril prvni spatne zadany vstup - pomoci focus(),
    // nadefinovane v Inputu. Pokud je vse v poradku, probehne authCtx.onLogin.
    if (formIsValid) {
      // tohle bylo predtim (pred pouzitim forward refs) bez if.
      authCtx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          type="email"
          label="E-mail"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          type="password"
          label="Password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;

/*
Puvodni button (pred pouzivanim Forward Refs):
<Button type="submit" className={classes.btn} disabled={!formIsValid}>
*/

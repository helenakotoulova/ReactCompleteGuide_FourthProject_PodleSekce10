import React, { useRef, useImperativeHandle } from "react";
import classes from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const activate = () => {
    inputRef.current.focus(); // focus() je built in JS object. imperativni.
  };

  useImperativeHandle(ref,()=> {
      return {
          focus: activate // imperative Handler nam umoznuje pouzit imperativni stranku REactu, musime jeste pouzit React.forwardRef.
      } // pomoci imperative Handleru tedka forwardujeme focus, ve kterem je schovana nase funkce activate.
  })
  return (
    <div
      className={`${classes.control} ${
        props.isValid === false ? classes.invalid : "" // pred pouzitim useReducer bylo emailIsValid === false?
      }`}
    >
      <label htmlFor="{props.id}">{props.label}</label>
      <input
        ref={inputRef}
        type={props.type}
        id={props.id}
        value={props.value} // pred pouzitim useReducer bylo value={enteredEmail}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
});

export default Input;

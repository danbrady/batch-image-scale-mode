import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";

import "./ui.css";

const App = () => {
  const nodeRef = useRef(null);
  const [selected, setSelected] = useState("FIT");
  const [appliedCount, setAppliedCount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  let timer;

  const handleClick = (e) => {
    e.preventDefault();
    parent.postMessage(
      {
        pluginMessage: {
          scaleMode: selected,
        },
      },
      "*"
    );
  };

  const hideStatus = () => {
    timer = setTimeout(() => {
      setShowConfirmation(false);
      clearTimeout(timer);
    }, 3000);
  };

  window.addEventListener("message", (message) => {
    setAppliedCount(message.data.pluginMessage.appliedCount);
    setShowConfirmation(true);
  });

  return (
    <div className="app">
      <div className="mb-2 flex flex-align-items-center">
        <span>
          <label htmlFor="scaleMode">Change Selected Images Scale Modes to:</label>
        </span>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          id="scaleMode"
          name="scaleMode"
          className="select-menu"
        >
          <option value="FILL">Fill</option>
          <option value="FIT">Fit</option>
          <option value="CROP">Crop</option>
          <option value="TILE">Tile</option>
        </select>
        <input type="submit" id="submit" value="Apply" className="submit" onClick={handleClick} />
      </div>

      <div>
        <CSSTransition nodeRef={nodeRef} in={showConfirmation} timeout={200} className="status" onEntered={hideStatus}>
          <div ref={nodeRef}>
            <b>{appliedCount}</b> selection{appliedCount === 1 ? "" : "s"} updated.
          </div>
        </CSSTransition>
      </div>
    </div>
  );
};

export default App;

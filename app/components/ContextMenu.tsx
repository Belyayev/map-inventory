import React, { useEffect, useRef } from "react";

const ContextMenu = ({ position, onAddInventory, onAddLocation, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        top: position.y,
        left: position.x,
        backgroundColor: "white",
        border: "1px solid #ccc",
        zIndex: 1000,
      }}
    >
      <button onClick={onAddInventory}>Add Inventory</button>
      <button onClick={onAddLocation}>Add Location</button>
    </div>
  );
};

export default ContextMenu;

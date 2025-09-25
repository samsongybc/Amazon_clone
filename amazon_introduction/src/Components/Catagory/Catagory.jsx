import React from "react";
import { catagoryInfos } from "./catagoryFullInfo";
import CatagoryCard from "./CatagoryCard";
import classes from "./catagory.module.css";

const Catagory = () => {
  return (
    <section className={classes.catagory_container}>
      {catagoryInfos.map((infos, index) => {
        console.log(infos);
        return <CatagoryCard data={infos} key={infos.name || index} />;
      })}
    </section>
  );
};

export default Catagory;

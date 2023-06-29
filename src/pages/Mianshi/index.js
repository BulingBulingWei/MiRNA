import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: scroll;
`;

const Label = styled.p`
  height: fit-content;
  width: fit-content;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  font-weight: 600;
`;

const Button = styled.div`
  height: fit-content;
  width: fit-content;
  border-width: 2px;
  border-radius: 0.25rem;
  padding: 1rem 1.2rem;
  background: #eaedf5;
`;

const OrderBox = styled.div`
  height: fit-content;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const OrderInfo = styled.div`
  height: 3rem;
  width: 5rem;
  border-width: 2px;
  border-radius: 0.25rem;
  padding: 2px 0 2px 0;
`;

export default function Mianshi() {
  let baseurl = "xxx";
  let list = [];
  let idList = [];
  const [orderList, setOrderList] = useState([]);

  //获取订单的id(这里假设id需要通过请求获得)
  const GetOrderId = async () => {
    let options = {
      url: `${baseurl}/api/orderId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    let res = await axios(options);
    //这里设置200为成功码（具体数值当与后端商量）
    if (res.data.code === "200") {
      idList = res.data.data;
    }
    //请求不成功
    else {
      console.log("error");
    }
  };

  //获取新一批订单的详细信息
  const GetOrderInfo = async () => {
    for (let i = 0; i < 10; i++) {
      let options = {
        url: `${baseurl}/api/order/${idList[i]}`,
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      let res = await axios(options);

      //这里设置200为成功码（具体数值当与后端商量）
      if (res.data.code === "200") {
        list.push(res.data.data);
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
        setOrderList(list);
      }
      //请求不成功
      else {
        console.log("error");
      }
    }
  };

  //节流函数
  function throttle(fn, timeout) {
    var can = true;
    return function (...args) {
      if (can === true) {
        can = false;
        setTimeout(() => {
          fn(...args);
          can = true;
        }, timeout);
      }
    };
  }

  const Update = () => {
    GetOrderId();
    GetOrderInfo();
  };

  //给更新操作加上节流优化
  const handleUpdate = throttle(Update, 1000);

  return (
    <Container>
      <Label>订单 :</Label>
      <Button onClick={handleUpdate}>更新</Button>
      <OrderBox>
        {orderList.map((order) => {
          return (
            <OrderInfo key={order.id}>
              <p>{order.name}</p>
              <p>最后修改时间：{order.date}</p>
            </OrderInfo>
          );
        })}
      </OrderBox>
    </Container>
  );
}

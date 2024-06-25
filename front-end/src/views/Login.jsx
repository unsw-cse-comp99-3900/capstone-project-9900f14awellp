import React from "react";
import { useNavigate } from "react-router-dom";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../libs/shadcn/Accordion"

export default function Login() {
    //* 路由跳转
    const navigate = useNavigate();
    const goRegister = () => {
        navigate("/register");
    }
    const goDashboard = () => {
        navigate("/home");
    }
    return (
        <div>
            <h1 className="text-3xl font-bold underline" >Login Page</h1>
            <button className="bg-sky-500 hover:bg-sky-700" onClick={goRegister}>dont have account, go register</button>
            <button onClick={goDashboard}>finish Login, go Dashboard</button>
            <div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Is it styled?</AccordionTrigger>
                    <AccordionContent>
                    Yes. It comes with default styles that matches the other
                    components&apos; aesthetic.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>
                    Yes. It&apos;s animated by default, but you can disable it if you
                    prefer.
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
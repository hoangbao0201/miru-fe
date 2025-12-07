"use client";

import { styled } from "styled-components";
import IconVietNam from "@/components/Modules/Icons/IconVietNam";

const WinterStyles = styled.div`
    height: 100%;
    .Snowstyles_lay1 {
        .Snowstyles_lay0 {
            color: white;
            position: fixed;
            top: -10%;
            z-index: 9999;
            user-select: none;
            cursor: default;
            animation-name: snowflakes-fall, snowflakes-shake;
            animation-duration: 10s, 3s;
            animation-timing-function: linear, ease-in-out;
            animation-iteration-count: infinite, infinite;
            animation-play-state: running, running;

            &:nth-of-type(1) {
                left: 10%;
                animation-delay: 1s, 1s;
            }
            &:nth-of-type(2) {
                left: 20%;
                animation-delay: 6s, 0.5s;
            }
            &:nth-of-type(3) {
                left: 30%;
                animation-delay: 4s, 2s;
            }
            &:nth-of-type(4) {
                left: 40%;
                animation-delay: 2s, 2s;
            }
            &:nth-of-type(5) {
                left: 50%;
                animation-delay: 8s, 3s;
            }
            &:nth-of-type(6) {
                left: 60%;
                animation-delay: 6s, 2s;
            }
            &:nth-of-type(7) {
                left: 70%;
                animation-delay: 2.5s, 1s;
            }
            &:nth-of-type(8) {
                left: 80%;
                animation-delay: 1s, 0s;
            }
            &:nth-of-type(9) {
                left: 90%;
                animation-delay: 3s, 1.5s;
            }
            &:nth-of-type(10) {
                left: 25%;
                animation-delay: 2s, 0s;
            }
            &:nth-of-type(11) {
                left: 65%;
                animation-delay: 4s, 2.5s;
            }
            &:nth-of-type(12) {
            }
        }
    }

    @keyframes snowflakes-fall {
        0% {
            top: -10%;
        }
        100% {
            top: 100%;
        }
    }
    @keyframes snowflakes-shake {
        0%,
        100% {
            transform: translateX(0px);
        }
        50% {
            transform: translateX(80px);
        }
    }
`;

const EventFlag = () => {
    return (
        <WinterStyles>
            <div className="Snowstyles_lay1">
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
                <div className="Snowstyles_lay0">
                    <IconVietNam className="opacity-40" />
                </div>
            </div>
        </WinterStyles>
    );
};

export default EventFlag;
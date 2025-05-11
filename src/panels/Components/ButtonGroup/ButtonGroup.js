import "./ButtonGroup.css";

import BottomButton from "./Buttons/BottomButton/BottomButton";
import { ButtonGroup } from "@vkontakte/vkui";

const MyButtonGroup = ({ mode, gap, texts = [], push = [] }) => {
    return (
        <ButtonGroup
            style={{}}
            mode={mode}
            gap={gap}
            stretched>
            {texts.map((text, index) => (
                <BottomButton
                    key={index}
                    text={text}
                    push={push[index]}
                />
            ))}
        </ButtonGroup>
    );
};

export default MyButtonGroup;
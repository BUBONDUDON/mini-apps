import "./BottomButton.css";

import { Button } from "@vkontakte/vkui";

import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

const BottomButton = ({ text, push }) => {
    const navigator = useRouteNavigator();
    return (
        <Button
            style={{}}
            stretched
            className="botom-button"
            onClick={() =>
                navigator.replace(push)}
        >{text}</Button>);
};

export default BottomButton;
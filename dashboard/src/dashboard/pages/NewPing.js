import { useHistory } from "react-router-dom";

const NewPing = () => {
  const history = useHistory();

  history.push("/ping/0");

  return null;
};

const NewPong = () => {
  const history = useHistory();

  history.push("/pong/0");

  return null;
};

export { NewPing, NewPong };

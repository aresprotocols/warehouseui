import { unmountComponentAtNode } from "react-dom";

const Modal = props => {
	const handleClose = event => {
		unmountComponentAtNode(document.getElementById("modalContainer"));
	};

	return (<div className="modalLayout">
		<div className="modalContent">
			<button className="closeButton" onClick={handleClose}>✖︎</button>

			{props.children}
		</div>
	</div>);
}

export default Modal;
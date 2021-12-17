const ResourceLabel = (props) => {
  return (
    <div className="ResourceLabelLayout">
      <img
        src={"/images/exchanges/" + props.data.name + ".png"}
        width="32px"
        alt=""
      />
      <div className="title">{props.data.name}</div>
      <div className="price">
        ${props.data.price ? props.data.price.toLocaleString() : "-"}
      </div>
      <div className="weight">{props.data.weight ?? 0}&nbsp;weight</div>
    </div>
  );
};

export default ResourceLabel;

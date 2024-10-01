const CustomTooltip = ({ value }: { value: string }) => (
  <div
    style={{
      padding: "5px 10px",
      background: "white",
      border: "1px solid #ccc",
    }}
  >
    <strong>{value}</strong>
    <br />
  </div>
)

export default CustomTooltip

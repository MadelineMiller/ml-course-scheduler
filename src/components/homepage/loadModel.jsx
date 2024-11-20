import Progress from '../Progress';
import { CustomButton } from './scheduler';

function LoadModel({
  ready,
  disabled,
  progressItems,
  translate,
}) {
  return (
    <>
      <div className="subtitle" style={{marginTop: "20vh", fontSize: "20px"}}>
        Load the model before you start
        <CustomButton
      disabled={disabled}
        variant="contained"
        type="submit"
        onClick={translate}
        style={{marginLeft: "20px"}}
    >
        Load
    </CustomButton>
    </div>
     

      <div className="progress-bars-container">
        {ready === false && <label>Loading models... (only run once)</label>}
        {progressItems.map((data) => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div>
    </>
  );
}

export default LoadModel;

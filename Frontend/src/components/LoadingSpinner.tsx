import { HashLoader } from 'react-spinners';

const override = {
    display: 'block',
    margin: '0 auto',
    borderColor: 'red'
};

function LoadingSpinner() {
    return (
        <div className="container-style">
            <HashLoader
                cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
                color="#36d7b7"
            />
        </div>
    );
}
export default LoadingSpinner;

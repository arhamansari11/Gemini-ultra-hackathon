import { RotatingTriangles } from "react-loader-spinner";


const Loader = () => {
    return <div className="container-fluid">
        <div className="row  bg-dark text-white" style={{ height: "100vh" }}>
            <div className="col-1 col-sm-2" >
            </div>
            <div className="col-10 col-sm-8 text-center d-flex align-items-center justify-content-center" >
                <p >
                    {/* <Grid
                        visible={true}
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="grid-loading"
                        radius="12.5"
                        wrapperStyle={{}}
                        wrapperClass="grid-wrapper"
                    /> */}
                    <RotatingTriangles
                        visible={true}
                        height="150"
                        width="150"
                        colors={['#00b555','#e6e6e6', '#0076c3']}
                        ariaLabel="rotating-triangles-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </p>
            </div>
            <div className="col-1 col-sm-2" >
            </div>
        </div>
    </div>;
};

export default Loader;


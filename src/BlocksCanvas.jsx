export default function BlocksCanvas() {
    return (
        <div className="panel panel-left" id="blocks-canvas">
            {/* Top bar */}
            <div className="blocks-toolbar">
                <div className="dropdown">
                    <button className="dropbtn">Geometric Objects</button>
                    <div className="dropdown-content">
                        <div>Point</div>
                        <div>Line</div>
                        <div>Plane</div>
                        <div>Vector</div>
                    </div>
                </div>
                <button>Operators</button>
                <button>Measurements</button>
            </div>

            {/* Blocks area (empty for now) */}
            <div className="blocks-content">
                {/* Future block UI will go here */}
            </div>
        </div>
    )
}

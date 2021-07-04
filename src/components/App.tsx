import "./App.css"
import { NumberPicker } from "components"
import { Result } from "types"
export default function App() {

    function handleDistribution(results: Result[]) {
        console.log(results)
    }

    return <div className="demo"> 
    <NumberPicker people={7} rooms={[{ min: 0, max: 4 }, { min: 1, max: 5 }, { min: 2, max: 3 }]} handleDistribution={handleDistribution} />
    </div>

}

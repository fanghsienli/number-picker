import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import "./NumberPicker.css"
import { Result } from "types"
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/all'



type Room = {
    min: number
    max: number
}

type Props = {
    people: number
    rooms: Room[]
    handleDistribution: (results: Result[]) => void
}

type RoomResult = Room & Result & {
    id: number
}

export default function NumberPicker(props: Props) {
    const { people, rooms } = props


    const [roomResults, setRoomResults] = useState<RoomResult[]>([])

    useEffect(() => {
        let roomResults: RoomResult[] = []
        for (let i = 0; i < rooms.length; i++) {
            roomResults.push({
                ...rooms[i],
                id: i,
                adult: rooms[i].min,
                child: 0
            })
        }
        setRoomResults(roomResults)
    }, [])

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "-" || e.key === ".") e.preventDefault()
    }

    function onBlur(e: React.FocusEvent<HTMLInputElement>) {
        //console.log(e.currentTarget.value)
    }

    function onClick(roomResult: RoomResult, key: string, add: number) {
        const minValue = key === "child" ? 0 : roomResult.min
        const maxValue = roomResult.max - (key === "child" ? roomResult.adult : roomResult.child)
        if (roomResult[key] + add <= maxValue && roomResult[key] + add >= minValue) {
            let id = roomResult.id
            const newRoomResults = roomResults.map((roomResult: RoomResult) => {
                if (roomResult.id === id) {
                    return {
                        ...roomResult,
                        [key]: roomResult[key] + add
                    }
                }
                return roomResult
            })
            if (newRoomResults.map(x => x.child + x.adult).reduce((a, b) => a + b) <= people) {
                setRoomResults(newRoomResults)
                props.handleDistribution(newRoomResults.map(x => { return { adult: x.adult, child: x.child } }))
            }
        }
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>, roomResult: RoomResult, key: string) {
        let newValue = roomResult[key]
        const minValue = key === "child" ? 0 : roomResult.min
        const maxValue = roomResult.max - (key === "child" ? roomResult.adult : roomResult.child)
        const changeValue = e.currentTarget.value === "" ? 0 : parseInt(e.currentTarget.value)
        if (changeValue >= minValue || parseInt(e.currentTarget.value) <= maxValue) newValue = changeValue
        if (changeValue < minValue) newValue = minValue
        if (changeValue > maxValue) newValue = maxValue

        if (roomResult[key] !== newValue) {
            let id = roomResult.id
            const newRoomResults = roomResults.map((roomResult: RoomResult) => {
                if (roomResult.id === id) {
                    return {
                        ...roomResult,
                        [key]: newValue
                    }
                }
                return roomResult
            })
            if (newRoomResults.map(x => x.child + x.adult).reduce((a, b) => a + b) <= people) {
                setRoomResults(newRoomResults)
                props.handleDistribution(newRoomResults.map(x => { return { adult: x.adult, child: x.child } }))
            }
        }
    }


    return <div className="numberPicker">
        <div className="title">住客人數：{people} 人 / {rooms.length} 房</div>
        {roomResults.map((roomResult: RoomResult, index) =>
            <div className="room" key={roomResult.id}>
                {index > 0 && <div className="divider"></div>}
                <div className="row">
                    <div className="title">
                        房間：{(roomResult.adult ? roomResult.adult : 0) + (roomResult.child ? roomResult.child : 0)} 人
                    </div>
                </div>
                <div className="row">
                    <div className="cell">
                        <div>大人</div>
                        <div className="sub">年齡 20+</div>
                    </div>
                    <div className="cell">
                        <div className="control-box">
                            <AiOutlineMinus className="box" onClick={() => onClick(roomResult, "adult", -1)} />
                            <input type="number" pattern="\d*"
                                min={roomResult.min}
                                max={roomResult.max}
                                step={1}
                                value={roomResult.adult ? roomResult.adult.toString() : "0"}
                                onChange={(e) => onChange(e, roomResult, "adult")}
                                onBlur={onBlur}
                                onKeyDown={onKeyDown} />
                            <AiOutlinePlus className="box" onClick={() => onClick(roomResult, "adult", 1)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="cell">
                        <div>小孩</div>
                        <div className="sub">年齡 0+</div>
                    </div>
                    <div className="cell">
                        <div className="control-box">
                            <AiOutlineMinus className="box" onClick={() => onClick(roomResult, "child", -1)} />
                            <input type="number"
                                pattern="\d*"
                                min={roomResult.min}
                                max={roomResult.max}
                                value={roomResult.child ? roomResult.child.toString() : "0"}
                                step={1}
                                onBlur={onBlur}
                                onChange={(e) => onChange(e, roomResult, "child")}
                                onKeyDown={onKeyDown} />
                            <AiOutlinePlus className="box" onClick={() => onClick(roomResult, "child", 1)} />
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
}

NumberPicker.propTypes = {
    people: PropTypes.number,
    rooms: PropTypes.arrayOf(PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number
    })),
    handleDistribution: PropTypes.func
};
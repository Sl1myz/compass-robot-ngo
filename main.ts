function readScreen () {
    if (huskylens.readeBox(1, Content1.width) > 160) {
        floor_id = 1
    } else if (huskylens.readeBox(2, Content1.width) > 160) {
        floor_id = 2
    } else if (huskylens.isAppear(1, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
    	
    } else {
    	
    }
}
input.onButtonPressed(Button.A, function () {
    compass_base_1 = input.compassHeading()
    compass_base_2 = (input.compassHeading() + 180) % 360
})
let compass_heading = 0
let compass_base_2 = 0
let compass_base_1 = 0
let floor_id = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
basic.forever(function () {
    compass_heading = input.compassHeading()
})

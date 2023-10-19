function readArea () {
    huskylens.request()
    if (huskylens.isAppear(3, HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
        floor_id = 3
    } else if (huskylens.readeBox(1, Content1.width) > 160) {
        floor_id = 1
    } else if (huskylens.readeBox(2, Content1.width) > 160) {
        floor_id = 2
    } else {
        floor_id = 0
    }
}
function catchBall () {
    iBIT.Motor(ibitMotor.Forward, 25)
    basic.pause(500)
    iBIT.Servo(ibitServo.SV2, 90)
    iBIT.MotorStop()
    basic.pause(500)
    iBIT.Motor(ibitMotor.Backward, 30)
    basic.pause(1000)
    iBIT.MotorStop()
    compass_heading = input.compassHeading()
}
function rotateTo (angle: number) {
    compass_heading = input.compassHeading()
    if (Math.abs(compass_heading - angle) < 180) {
        rotateTo_direction = 0
    } else {
        rotateTo_direction = 1
    }
    while (compass_heading > angle + 30 || compass_heading < angle - 30) {
        if (rotateTo_direction == 0) {
            iBIT.Spin(ibitSpin.Right, 40)
        } else {
            iBIT.Spin(ibitSpin.Left, 40)
        }
        basic.pause(100)
        iBIT.MotorStop()
        compass_heading = input.compassHeading()
    }
    iBIT.MotorStop()
}
function moveByArea () {
    if (floor_id > 0) {
        iBIT.MotorStop()
        if (floor_id == 1) {
            rotateTo(compass_base_2)
        } else if (floor_id == 2) {
            rotateTo(compass_base_1)
        } else if (floor_id == 3) {
            iBIT.Motor(ibitMotor.Backward, 30)
            basic.pause(500)
            iBIT.Spin(ibitSpin.Left, 50)
            basic.pause(200)
        }
    } else {
        if (!(huskylens.isAppear_s(HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
            random_movement = randint(1, 16)
        } else {
            random_movement = 0
        }
        if (random_movement == 1) {
            basic.showLeds(`
                # # . . .
                # . . . .
                # . . # #
                . . . # .
                . . . # .
                `)
            iBIT.Turn(ibitTurn.Left, 40)
            basic.pause(300)
        } else if (random_movement == 2) {
            basic.showLeds(`
                # # . . .
                # . . . .
                # . . # .
                . . . # .
                . . . # #
                `)
            iBIT.Turn(ibitTurn.Right, 40)
            basic.pause(300)
        }
        if (huskylens.isAppear_s(HUSKYLENSResultType_t.HUSKYLENSResultBlock)) {
            iBIT.Motor(ibitMotor.Forward, 20)
        } else {
            iBIT.Motor(ibitMotor.Forward, 30)
        }
    }
}
function initializeState (toState: number) {
    if (toState == 0) {
        iBIT.Servo(ibitServo.SV1, 0)
        iBIT.Servo(ibitServo.SV2, 0)
        ball_id = 0
    } else if (toState == 1) {
        compass_heading = input.compassHeading()
        compass_stored = compass_heading
        catchBall()
    } else {
        iBIT.Servo(ibitServo.SV1, 0)
        iBIT.Servo(ibitServo.SV2, 90)
        basic.showString("P")
    }
    state = toState
}
function whereTFdoIthrowThisThing () {
    if (ball_id == 1) {
        rotateTo(compass_base_1)
    } else if (ball_id == 2) {
        rotateTo(compass_base_2)
    }
    throwDaBall()
    rotateTo(compass_stored)
    initializeState(0)
}
input.onButtonPressed(Button.A, function () {
    compass_base_2 = input.compassHeading()
    compass_base_1 = (input.compassHeading() + 180) % 360
    initializeState(2)
})
function turnTowardsBall () {
    getBallCOORD()
    if (ball_y > 120 && ball_x < 195) {
        initializeState(1)
    } else {
        while (ball_x > 160 || ball_x < 130) {
            if (ball_x > 160) {
                iBIT.Spin(ibitSpin.Left, 25)
            } else {
                iBIT.Spin(ibitSpin.Right, 25)
            }
            getBallCOORD()
            compass_heading = input.compassHeading()
            if (!(huskylens.isAppear(ball_id, HUSKYLENSResultType_t.HUSKYLENSResultBlock))) {
                break;
            }
        }
        iBIT.MotorStop()
    }
}
function throwDaBall () {
    basic.showIcon(IconNames.Skull)
    iBIT.Servo(ibitServo.SV2, 0)
    iBIT.Motor(ibitMotor.Forward, 50)
    basic.pause(300)
    iBIT.Servo(ibitServo.SV1, 120)
    basic.pause(200)
    iBIT.MotorStop()
    basic.pause(200)
    iBIT.Servo(ibitServo.SV1, 0)
    iBIT.Motor(ibitMotor.Backward, 50)
    basic.pause(500)
    iBIT.MotorStop()
}
function getBallCOORD () {
    huskylens.request()
    ball_x = huskylens.readeBox(ball_id, Content1.xCenter)
    ball_y = huskylens.readeBox(ball_id, Content1.yCenter)
    huskylens.writeOSD("x:" + ball_x + " y:" + ball_y, ball_x, ball_y)
}
input.onButtonPressed(Button.AB, function () {
    iBIT.Servo(ibitServo.SV2, 0)
})
input.onButtonPressed(Button.B, function () {
    initializeState(0)
})
function readBall () {
    huskylens.request()
    if (huskylens.readBox_s(Content3.yCenter) > 30 && (huskylens.readBox_s(Content3.width) < 80 && huskylens.readBox_s(Content3.height) < 80)) {
        ball_id = huskylens.readBox_s(Content3.ID)
        if (ball_id == 1 || ball_id == 2) {
            turnTowardsBall()
        }
    } else {
        ball_id = 0
    }
}
let ball_x = 0
let ball_y = 0
let state = 0
let compass_stored = 0
let ball_id = 0
let random_movement = 0
let compass_base_1 = 0
let compass_base_2 = 0
let rotateTo_direction = 0
let compass_heading = 0
let floor_id = 0
huskylens.initI2c()
huskylens.initMode(protocolAlgorithm.ALGORITHM_COLOR_RECOGNITION)
basic.pause(500)
initializeState(2)
let speed_battery = 20
basic.forever(function () {
    if (state == 0) {
        basic.showNumber(0)
        readBall()
        readArea()
        moveByArea()
    } else if (state == 1) {
        basic.showNumber(1)
        whereTFdoIthrowThisThing()
    } else {
        iBIT.MotorStop()
    }
})

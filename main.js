function numberToNoteName(number) {
    var result = []
    const dict = {
        '1': 'C',
        '2': 'D',
        '3': 'E',
        '4': 'F',
        '5': 'G',
        '6': 'A',
        '7': 'B'
    }
    const shiftDownChars = ['.', ',']
    const shiftUpChars = ['`', '\'']

    if (!(number[0] in dict)) return undefined //error
    else result.push(dict[number[0]])

    var curr = 1
    if (number.length >= 2) {
        if (number[1] === '#' || number[1] === 'b') {
            curr = 2
            result.push(number[1]);
        }
    }

    var shift = 0
    var lastShift = 0
    for (; curr < number.length; curr++) {
        if (shiftDownChars.includes(number[curr])) {
            if (lastShift <= 0) {
                shift--
                lastShift = -1
            }
            else return undefined //error
        }
        else if (shiftUpChars.includes(number[curr])) {
            if (lastShift >= 0) {
                shift++
                lastShift = 1
            }
            else return undefined //error
        }
        else return undefined //error
    }
    result.push(String.fromCharCode("4".charCodeAt(0) + shift))
    
    return result.join("")
}

function transposeNote(fromKey, noteName) {
    var distance = Tonal.distance("C", fromKey)
    return Tonal.Note.transpose(noteName, distance)
}

function noteNameToNumber(noteName) {
    const dict = {
        'C': '1',
        'D': '2',
        'E': '3',
        'F': '4',
        'G': '5',
        'A': '6',
        'B': '7'
    }

    var result = ""
    result += dict[noteName[0]]

    var shift = 0
    if (noteName[1] === '#' || noteName[1] === 'b') {
        result += noteName[1]
        shift = Number(noteName[2]) - 4 + Number($("#octaveIncrement").val())
    }
    else {
        shift = Number(noteName[1]) - 4 + Number($("#octaveIncrement").val())
    }
    if (shift < 0) result += ".".repeat(-shift)
    else if (shift > 0) result += "'".repeat(shift)

    return result
}

function transpose() {
    const possibleChars = ['.', ',', '`', '\'', '#', 'b']
    const input = $("#input").val() + " "
    const fromKey = $("#fromKey").val()
    var output = ""
    var startPos = -1
    for (var i = 0; i < input.length; i++) {
        if (startPos == -1) {
            if ("1".charCodeAt(0) <= input.charCodeAt(i) && input.charCodeAt(i) <= "7".charCodeAt(0)) {
                startPos = i
            } else {
                output += input[i]
            }
        }
        else {
            if (!(possibleChars.includes(input[i]))) {
                var result = numberToNoteName(input.substring(startPos, i))
                if (typeof result == "string") {
                    output += "<span class='text-success'>" + noteNameToNumber(transposeNote(fromKey, result)) + "</span>"
                }
                else {
                    output += "<span class='text-danger'>" + "?".repeat(i - startPos) + "</span>"
                }
                if ("1".charCodeAt(0) <= input.charCodeAt(i) && input.charCodeAt(i) <= "7".charCodeAt(0)) {
                    startPos = i
                } else {
                    startPos = -1
                    output += input[i]
                }
            }
        }
    }

    output = output.slice(0, -1) //remove space character
    output = output.replace(/(?:\r\n|\r|\n)/g, '<br>') //replace all line breaks with <br>
    if (output.length == 0) output = "<br>".repeat(5)
    $("#output").html(output)
}
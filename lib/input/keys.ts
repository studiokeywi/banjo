/**
 * Constant values related to keyboard events and utility functions to help with "meta" state for keyboard events
 *
 * @module input/keys
 * @author studioKeywi */

// NOTE: undocumented
// #region Letters
/**
 * TODO: JSDocs
 */
export const $aA = { code: 'KeyA' } as const;

/**
 * TODO: JSDocs
 */
export const $a = { code: 'KeyA', key: 'a' } as const;

/**
 * TODO: JSDocs
 */
export const $A = { code: 'KeyA', key: 'A' } as const;

/**
 * TODO: JSDocs
 */
export const $bB = { code: 'KeyB' } as const;

/**
 * TODO: JSDocs
 */
export const $b = { code: 'KeyB', key: 'b' } as const;

/**
 * TODO: JSDocs
 */
export const $B = { code: 'KeyB', key: 'B' } as const;

/**
 * TODO: JSDocs
 */
export const $cC = { code: 'KeyC' } as const;

/**
 * TODO: JSDocs
 */
export const $c = { code: 'KeyC', key: 'c' } as const;

/**
 * TODO: JSDocs
 */
export const $C = { code: 'KeyC', key: 'C' } as const;

/**
 * TODO: JSDocs
 */
export const $dD = { code: 'KeyD' } as const;

/**
 * TODO: JSDocs
 */
export const $d = { code: 'KeyD', key: 'd' } as const;

/**
 * TODO: JSDocs
 */
export const $D = { code: 'KeyD', key: 'D' } as const;

/**
 * TODO: JSDocs
 */
export const $eE = { code: 'KeyE' } as const;

/**
 * TODO: JSDocs
 */
export const $e = { code: 'KeyE', key: 'e' } as const;

/**
 * TODO: JSDocs
 */
export const $E = { code: 'KeyE', key: 'E' } as const;

/**
 * TODO: JSDocs
 */
export const $fF = { code: 'KeyF' } as const;

/**
 * TODO: JSDocs
 */
export const $f = { code: 'KeyF', key: 'f' } as const;

/**
 * TODO: JSDocs
 */
export const $F = { code: 'KeyF', key: 'F' } as const;

/**
 * TODO: JSDocs
 */
export const $gG = { code: 'KeyG' } as const;

/**
 * TODO: JSDocs
 */
export const $g = { code: 'KeyG', key: 'g' } as const;

/**
 * TODO: JSDocs
 */
export const $G = { code: 'KeyG', key: 'G' } as const;

/**
 * TODO: JSDocs
 */
export const $hH = { code: 'KeyH' } as const;

/**
 * TODO: JSDocs
 */
export const $h = { code: 'KeyH', key: 'h' } as const;

/**
 * TODO: JSDocs
 */
export const $H = { code: 'KeyH', key: 'H' } as const;

/**
 * TODO: JSDocs
 */
export const $iI = { code: 'KeyI' } as const;

/**
 * TODO: JSDocs
 */
export const $i = { code: 'KeyI', key: 'i' } as const;

/**
 * TODO: JSDocs
 */
export const $I = { code: 'KeyI', key: 'I' } as const;

/**
 * TODO: JSDocs
 */
export const $jJ = { code: 'KeyJ' } as const;

/**
 * TODO: JSDocs
 */
export const $j = { code: 'KeyJ', key: 'j' } as const;

/**
 * TODO: JSDocs
 */
export const $J = { code: 'KeyJ', key: 'J' } as const;

/**
 * TODO: JSDocs
 */
export const $kK = { code: 'KeyK' } as const;

/**
 * TODO: JSDocs
 */
export const $k = { code: 'KeyK', key: 'k' } as const;

/**
 * TODO: JSDocs
 */
export const $K = { code: 'KeyK', key: 'K' } as const;

/**
 * TODO: JSDocs
 */
export const $lL = { code: 'KeyL' } as const;

/**
 * TODO: JSDocs
 */
export const $l = { code: 'KeyL', key: 'l' } as const;

/**
 * TODO: JSDocs
 */
export const $L = { code: 'KeyL', key: 'L' } as const;

/**
 * TODO: JSDocs
 */
export const $mM = { code: 'KeyM' } as const;

/**
 * TODO: JSDocs
 */
export const $m = { code: 'KeyM', key: 'm' } as const;

/**
 * TODO: JSDocs
 */
export const $M = { code: 'KeyM', key: 'M' } as const;

/**
 * TODO: JSDocs
 */
export const $nN = { code: 'KeyN' } as const;

/**
 * TODO: JSDocs
 */
export const $n = { code: 'KeyN', key: 'n' } as const;

/**
 * TODO: JSDocs
 */
export const $N = { code: 'KeyN', key: 'N' } as const;

/**
 * TODO: JSDocs
 */
export const $oO = { code: 'KeyO' } as const;

/**
 * TODO: JSDocs
 */
export const $o = { code: 'KeyO', key: 'o' } as const;

/**
 * TODO: JSDocs
 */
export const $O = { code: 'KeyO', key: 'O' } as const;

/**
 * TODO: JSDocs
 */
export const $pP = { code: 'KeyP' } as const;

/**
 * TODO: JSDocs
 */
export const $p = { code: 'KeyP', key: 'p' } as const;

/**
 * TODO: JSDocs
 */
export const $P = { code: 'KeyP', key: 'P' } as const;

/**
 * TODO: JSDocs
 */
export const $qQ = { code: 'KeyQ' } as const;

/**
 * TODO: JSDocs
 */
export const $q = { code: 'KeyQ', key: 'q' } as const;

/**
 * TODO: JSDocs
 */
export const $Q = { code: 'KeyQ', key: 'Q' } as const;

/**
 * TODO: JSDocs
 */
export const $rR = { code: 'KeyR' } as const;

/**
 * TODO: JSDocs
 */
export const $r = { code: 'KeyR', key: 'r' } as const;

/**
 * TODO: JSDocs
 */
export const $R = { code: 'KeyR', key: 'R' } as const;

/**
 * TODO: JSDocs
 */
export const $sS = { code: 'KeyS' } as const;

/**
 * TODO: JSDocs
 */
export const $s = { code: 'KeyS', key: 's' } as const;

/**
 * TODO: JSDocs
 */
export const $S = { code: 'KeyS', key: 'S' } as const;

/**
 * TODO: JSDocs
 */
export const $tT = { code: 'KeyT' } as const;

/**
 * TODO: JSDocs
 */
export const $t = { code: 'KeyT', key: 't' } as const;

/**
 * TODO: JSDocs
 */
export const $T = { code: 'KeyT', key: 'T' } as const;

/**
 * TODO: JSDocs
 */
export const $uU = { code: 'KeyU' } as const;

/**
 * TODO: JSDocs
 */
export const $u = { code: 'KeyU', key: 'u' } as const;

/**
 * TODO: JSDocs
 */
export const $U = { code: 'KeyU', key: 'U' } as const;

/**
 * TODO: JSDocs
 */
export const $vV = { code: 'KeyV' } as const;

/**
 * TODO: JSDocs
 */
export const $v = { code: 'KeyV', key: 'v' } as const;

/**
 * TODO: JSDocs
 */
export const $V = { code: 'KeyV', key: 'V' } as const;

/**
 * TODO: JSDocs
 */
export const $wW = { code: 'KeyW' } as const;

/**
 * TODO: JSDocs
 */
export const $w = { code: 'KeyW', key: 'w' } as const;

/**
 * TODO: JSDocs
 */
export const $W = { code: 'KeyW', key: 'W' } as const;

/**
 * TODO: JSDocs
 */
export const $xX = { code: 'KeyX' } as const;

/**
 * TODO: JSDocs
 */
export const $x = { code: 'KeyX', key: 'x' } as const;

/**
 * TODO: JSDocs
 */
export const $X = { code: 'KeyX', key: 'X' } as const;

/**
 * TODO: JSDocs
 */
export const $yY = { code: 'KeyY' } as const;

/**
 * TODO: JSDocs
 */
export const $y = { code: 'KeyY', key: 'y' } as const;

/**
 * TODO: JSDocs
 */
export const $Y = { code: 'KeyY', key: 'Y' } as const;

/**
 * TODO: JSDocs
 */
export const $zZ = { code: 'KeyZ' } as const;

/**
 * TODO: JSDocs
 */
export const $z = { code: 'KeyZ', key: 'z' } as const;

/**
 * TODO: JSDocs
 */
export const $Z = { code: 'KeyZ', key: 'Z' } as const;
// #endregion Letters

// NOTE: undocumented
// #region Misc keys
/**
 * TODO: JSDocs
 */
export const $add = { key: '+' } as const;

/**
 * TODO: JSDocs
 */
export const $alt = { key: 'Alt', altKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $backslash = { code: 'Backslash', key: '\\' } as const;

/**
 * TODO: JSDocs
 */
export const $backspace = { code: 'Backspace', key: 'Backspace' } as const;

/**
 * TODO: JSDocs
 */
export const $backtick = { code: 'Backquote', key: '`' } as const;

/**
 * TODO: JSDocs
 */
export const $capsLock = { code: 'CapsLock', key: 'CapsLock' } as const;

/**
 * TODO: JSDocs
 */
export const $colon = { code: 'Semicolon', key: ':', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $comma = { code: 'Comma', key: ',' } as const;

/**
 * TODO: JSDocs
 */
export const $ctrl = { key: 'Control', ctrlKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $delete = { code: 'Delete', key: 'Delete' } as const;

/**
 * TODO: JSDocs
 */
export const $divide = { key: '/' } as const;

/**
 * TODO: JSDocs
 */
export const $doubleQuote = { code: 'Quote', key: '"', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $down = { code: 'ArrowDown', key: 'ArrowDown' } as const;

/**
 * TODO: JSDocs
 */
export const $end = { code: 'End', key: 'End' } as const;

/**
 * TODO: JSDocs
 */
export const $enter = { key: 'Enter' } as const;

/**
 * TODO: JSDocs
 */
export const $esc = { code: 'Escape', key: 'Escape' } as const;

/**
 * TODO: JSDocs
 */
export const $f1 = { code: 'F1', key: 'F1' } as const;

/**
 * TODO: JSDocs
 */
export const $f2 = { code: 'F2', key: 'F2' } as const;

/**
 * TODO: JSDocs
 */
export const $f3 = { code: 'F3', key: 'F3' } as const;

/**
 * TODO: JSDocs
 */
export const $f4 = { code: 'F4', key: 'F4' } as const;

/**
 * TODO: JSDocs
 */
export const $f5 = { code: 'F5', key: 'F5' } as const;

/**
 * TODO: JSDocs
 */
export const $f6 = { code: 'F6', key: 'F6' } as const;

/**
 * TODO: JSDocs
 */
export const $f7 = { code: 'F7', key: 'F7' } as const;

/**
 * TODO: JSDocs
 */
export const $f8 = { code: 'F8', key: 'F8' } as const;

/**
 * TODO: JSDocs
 */
export const $f9 = { code: 'F9', key: 'F9' } as const;

/**
 * TODO: JSDocs
 */
export const $f10 = { code: 'F10', key: 'F10' } as const;

/**
 * TODO: JSDocs
 */
export const $f11 = { code: 'F11', key: 'F11' } as const;

/**
 * TODO: JSDocs
 */
export const $f12 = { code: 'F12', key: 'F12' } as const;

/**
 * TODO: JSDocs
 */
export const $home = { code: 'Home', key: 'Home' } as const;

/**
 * TODO: JSDocs
 */
export const $insert = { code: 'Insert', key: 'Insert' } as const;

/**
 * TODO: JSDocs
 */
export const $left = { code: 'ArrowLeft', key: 'ArrowLeft' } as const;

/**
 * TODO: JSDocs
 */
export const $leftAlt = { code: 'AltLeft', key: 'Alt', altKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $leftAngleBracket = { code: 'Comma', key: '<', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $leftBracket = { code: 'BracketLeft', key: '{', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $leftCtrl = { code: 'ControlLeft', key: 'Control', ctrlKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $leftMeta = { code: 'MetaLeft', key: 'Meta', metaKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $leftShift = { code: 'ShiftLeft', key: 'Shift', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $leftSquareBracket = { code: 'BracketLeft', key: '[' } as const;

/**
 * TODO: JSDocs
 */
export const $meta = { key: 'Meta', metaKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $multiply = { key: '*' } as const;

/**
 * TODO: JSDocs
 */
export const $pageDown = { code: 'PageDown', key: 'PageDown' } as const;

/**
 * TODO: JSDocs
 */
export const $pageUp = { code: 'PageUp', key: 'PageUp' } as const;

/**
 * TODO: JSDocs
 */
export const $period = { code: 'Period', key: '.' } as const;

/**
 * TODO: JSDocs
 */
export const $pipe = { code: 'Backslash', key: '|', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $questionMark = { code: 'Slash', key: '?', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $return = { code: 'Enter', key: 'Enter' } as const;

/**
 * TODO: JSDocs
 */
export const $right = { code: 'ArrowRight', key: 'ArrowRight' } as const;

/**
 * TODO: JSDocs
 */
export const $rightAlt = { code: 'AltRight', key: 'Alt', altKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $rightAngleBracket = { code: 'Period', key: '>', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $rightBracket = { code: 'BracketRight', key: '}', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $rightCtrl = { code: 'ControlRight', key: 'Control', ctrlKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $rightMeta = { code: 'MetaRight', key: 'Meta', metaKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $rightShift = { code: 'ShiftRight', key: 'Shift', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $rightSquareBracket = { code: 'BracketRight', key: ']' } as const;

/**
 * TODO: JSDocs
 */
export const $semicolon = { code: 'Semicolon', key: ';' } as const;

/**
 * TODO: JSDocs
 */
export const $shift = { key: 'Shift', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $singleQuote = { code: 'Quote', key: "'" } as const;

/**
 * TODO: JSDocs
 */
export const $slash = { code: 'Slash', key: '/' } as const;

/**
 * TODO: JSDocs
 */
export const $subtract = { key: '-' } as const;

/**
 * TODO: JSDocs
 */
export const $tab = { code: 'Tab', key: 'Tab' } as const;

/**
 * TODO: JSDocs
 */
export const $tilde = { code: 'Backquote', key: '~', shiftKey: true } as const;

/**
 * TODO: JSDocs
 */
export const $up = { code: 'ArrowUp', key: 'ArrowUp' } as const;
// #endregion Misc keys

// NOTE: documented
// #region Numbers
/**
 * The zero (`0`) key from number row or number pad
 */
export const $0 = { key: '0' } as const;

/**
 * The one (`1`) key from number row or number pad
 */
export const $1 = { key: '1' } as const;

/**
 * The two (`2`) key from number row or number pad
 */
export const $2 = { key: '2' } as const;

/**
 * The three (`3`) key from number row or number pad
 */
export const $3 = { key: '3' } as const;

/**
 * The four (`4`) key from number row or number pad
 */
export const $4 = { key: '4' } as const;

/**
 * The five (`5`) key from number row or number pad
 */
export const $5 = { key: '5' } as const;

/**
 * The six (`6`) key from number row or number pad
 */
export const $6 = { key: '6' } as const;

/**
 * The seven (`7`) key from number row or number pad
 */
export const $7 = { key: '7' } as const;

/**
 * The eight (`8`) key from number row or number pad
 */
export const $8 = { key: '8' } as const;

/**
 * The nine (`9`) key from number row or number pad
 */
export const $9 = { key: '9' } as const;

/**
 * The ampersand (`&`) key
 */
export const $ampersand = { code: 'Digit7', key: '&', shiftKey: true } as const;

/**
 * The asterisk (`*`) key
 */
export const $asterisk = { code: 'Digit8', key: '*', shiftKey: true } as const;

/**
 * The at sign (`@`) key
 */
export const $at = { code: 'Digit2', key: '@', shiftKey: true } as const;

/**
 * The caret (`^`) key
 */
export const $caret = { code: 'Digit6', key: '^', shiftKey: true } as const;

/**
 * The dash (`-`) key
 */
export const $dash = { code: 'Minus', key: '-' } as const;

/**
 * Number row zero (`0`) key
 */
export const $digit0 = { code: 'Digit0', key: '0' } as const;

/**
 * Number row one (`1`) key
 */
export const $digit1 = { code: 'Digit1', key: '1' } as const;

/**
 * Number row two (`2`) key
 */
export const $digit2 = { code: 'Digit2', key: '2' } as const;

/**
 * Number row three (`3`) key
 */
export const $digit3 = { code: 'Digit3', key: '3' } as const;

/**
 * Number row four (`4`) key
 */
export const $digit4 = { code: 'Digit4', key: '4' } as const;

/**
 * Number row five (`5`) key
 */
export const $digit5 = { code: 'Digit5', key: '5' } as const;

/**
 * Number row six (`6`) key
 */
export const $digit6 = { code: 'Digit6', key: '6' } as const;

/**
 * Number row seven (`7`) key
 */
export const $digit7 = { code: 'Digit7', key: '7' } as const;

/**
 * Number row eight (`8`) key
 */
export const $digit8 = { code: 'Digit8', key: '8' } as const;

/**
 * Number row nine (`9`) key
 */
export const $digit9 = { code: 'Digit9', key: '9' } as const;

/**
 * The dollar sign (`$`) key
 */
export const $dollarSign = { code: 'Digit4', key: '$', shiftKey: true } as const;

/**
 * The equal sign (`=`) key
 */
export const $equal = { code: 'Equal', key: '=' } as const;

/**
 * The exclamation mark (`!`) key
 */
export const $exclamationMark = { code: 'Digit1', key: '!', shiftKey: true } as const;

/**
 * The hash/pound (`#`) key
 */
export const $hash = { code: 'Digit3', key: '#', shiftKey: true } as const;

/**
 * The left parenthesis (`(`) key
 */
export const $leftParen = { code: 'Digit9', key: '(', shiftKey: true } as const;

/**
 * The number pad addition (`+`) key
 */
export const $numAdd = { code: 'NumpadAdd', key: '+' } as const;

/**
 * The number pad decimal (`.`) key
 */
export const $numDecimal = { code: 'NumpadDecimal', key: '.' } as const;

/**
 * The number pad divide (`/`) key
 */
export const $numDivide = { code: 'NumpadDivide', key: '/' } as const;

/**
 * The number pad enter key
 */
export const $numEnter = { code: 'NumpadEnter', key: 'Enter' } as const;

/**
 * The number lock key
 */
export const $numLock = { code: 'NumLock', key: 'NumLock' } as const;

/**
 * The number pad multiplication (`*`) key
 */
export const $numMultiply = { code: 'NumpadMultiply', key: '*' } as const;

/**
 * The number pad subtraction (`-`) key
 */
export const $numSubtract = { code: 'NumpadSubtract', key: '-' } as const;

/**
 * The number pad zero (`0`) key
 */
export const $num0 = { code: 'Numpad0', key: '0' } as const;

/**
 * The number pad one (`1`) key
 */
export const $num1 = { code: 'Numpad1', key: '1' } as const;

/**
 * The number pad two (`2`) key
 */
export const $num2 = { code: 'Numpad2', key: '2' } as const;

/**
 * The number pad three (`3`) key
 */
export const $num3 = { code: 'Numpad3', key: '3' } as const;

/**
 * The number pad four (`4`) key
 */
export const $num4 = { code: 'Numpad4', key: '4' } as const;

/**
 * The number pad five (`5`) key
 */
export const $num5 = { code: 'Numpad5', key: '5' } as const;

/**
 * The number pad six (`6`) key
 */
export const $num6 = { code: 'Numpad6', key: '6' } as const;

/**
 * The number pad seven (`7`) key
 */
export const $num7 = { code: 'Numpad7', key: '7' } as const;

/**
 * The number pad eight (`8`) key
 */
export const $num8 = { code: 'Numpad8', key: '8' } as const;

/**
 * The number pad nine (`9`) key
 */
export const $num9 = { code: 'Numpad9', key: '9' } as const;

/**
 * The percent sign (`%`) key
 */
export const $percentSign = { code: 'Digit5', key: '%', shiftKey: true } as const;

/**
 * The plus sign (`+`) key
 */
export const $plus = { code: 'Equal', key: '+', shiftKey: true } as const;

/**
 * The right parenthesis (`)`) key
 */
export const $rightParen = { code: 'Digit0', key: ')', shiftKey: true } as const;

/**
 * The number row zero (`0`)/right parenthesis (`)`) key
 */
export const $row0 = { code: 'Digit0' } as const;

/**
 * The number row one (`1`)/exclamation mark (`!`) key
 */
export const $row1 = { code: 'Digit1' } as const;

/**
 * The number row two (`2`)/at sign (`@`) key
 */
export const $row2 = { code: 'Digit2' } as const;

/**
 * The number row three (`3`)/hash(/pound) (`#`) key
 */
export const $row3 = { code: 'Digit3' } as const;

/**
 * The number row four (`4`)/dollar sign (`$`) key
 */
export const $row4 = { code: 'Digit4' } as const;

/**
 * The number row five (`5 `)/percent sign (`%`) key
 */
export const $row5 = { code: 'Digit5' } as const;

/**
 * The number row six (`6`)/caret (`^`) key
 */
export const $row6 = { code: 'Digit6' } as const;

/**
 * The number row seven (`7`)/ampersand (`&`) key
 */
export const $row7 = { code: 'Digit7' } as const;

/**
 * The number row eight (`8`)/asterisk (`*`) key
 */
export const $row8 = { code: 'Digit8' } as const;

/**
 * The number row nine (`9`)/left parenthesis (`(`) key
 */
export const $row9 = { code: 'Digit9' } as const;

/**
 * The underscore (`_`) key
 */
export const $underscore = { code: 'Minus', key: '_', shiftKey: true } as const;
// #endregion Numbers

/**
 * Adds the `altKey` property to key information
 *
 * @template {KeyData} Data
 * @template {boolean} Value
 * @param {Data} data
 * @param {boolean} [value = true]
 * @returns {Data & { altKey: Value }} */
export const addAlt = <const Data extends KeyData, const Value extends boolean = true>(data: Data, value: Value = true as Value): Data & { altKey: Value } => ({
  ...data,
  altKey: value,
});

/**
 * Adds the `ctrlKey` property to key information
 *
 * @template {KeyData} Data
 * @template {boolean} Value
 * @param {Data} data
 * @param {boolean} [value = true]
 * @returns {Data & { ctrlKey: Value }} */
export const addCtrl = <const Data extends KeyData, const Value extends boolean = true>(
  data: Data,
  value: Value = true as Value
): Data & { ctrlKey: Value } => ({
  ...data,
  ctrlKey: value,
});

/**
 * Adds the `metaKey` property to key information
 *
 * @template {KeyData} Data
 * @template {boolean} Value
 * @param {Data} data
 * @param {boolean} [value = true]
 * @returns {Data & { metaKey: Value }} */
export const addMeta = <const Data extends KeyData, const Value extends boolean = true>(
  data: Data,
  value: Value = true as Value
): Data & { metaKey: Value } => ({
  ...data,
  metaKey: value,
});

/**
 * Adds the `shiftKey` property to key information
 *
 * @template {KeyData} Data
 * @template {boolean} Value
 * @param {Data} data
 * @param {boolean} [value = true]
 * @returns {Data & { shiftKey: Value }} */
export const addShift = <const Data extends KeyData, const Value extends boolean = true>(
  data: Data,
  value: Value = true as Value
): Data & { shiftKey: Value } => ({
  ...data,
  shiftKey: value,
});

/**
 * Information from a {@link KeyboardEvent} that is relevant to identifying a key press/release
 */
export interface KeyData {
  /**
   * Returns a boolean value that is true if the Alt (Option or ⌥ on macOS) key was active when the key event was generated.
   */
  altKey?: boolean;
  /**
   * Returns a string with the code value of the physical key represented by the event.
   */
  code?: string;
  /**
   * Returns a boolean value that is true if the Ctrl key was active when the key event was generated.
   */
  ctrlKey?: boolean;
  /**
   * Returns a string representing the key value of the key represented by the event.
   */
  key?: string;
  /**
   * Returns a boolean value that is true if the Meta key (on Mac keyboards, the ⌘ Command key; on Windows keyboards, the Windows key (⊞)) was active when the key event was generated.
   */
  metaKey?: boolean;
  /**
   * Returns a boolean value that is true if the Shift key was active when the key event was generated.
   */
  shiftKey?: boolean;
}

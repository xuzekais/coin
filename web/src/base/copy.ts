// 选择文本。createTextRange(setSelectionRange)是input方法
function selectText(textbox: any, startIndex: number, stopIndex: number) {
    if (textbox.createTextRange) {
        // https://developer.mozilla.org/en-US/docs/Web/API/TextRange
        // 兼容ie （≤8(Standard API after IE9)）
        const range = textbox.createTextRange();
        range.collapse(true);
        range.moveStart('character', startIndex); //起始光标
        range.moveEnd('character', stopIndex - startIndex); //结束光标
        range.select(); //不兼容苹果
    } else {
        // https://developer.mozilla.org/en-US/docs/Web/API/Selection
        //firefox/chrome
        textbox.setSelectionRange(startIndex, stopIndex);
        textbox.focus();
    }
}

export default function copy(text: string | number) {
    const textString = text.toString();
    const input: any = document.createElement('input');
    input.readOnly = 'readOnly'; // 防止ios聚焦触发键盘事件
    // 插入位置保证在屏幕可见区域，避免页面滚动
    input.style.position = 'absolute';
    // 避免显示在屏幕上
    input.style.zIndex = '-1000';
    input.style.top = `${window.pageYOffset || document.documentElement.scrollTop}px`;
    input.style.left = `${window.pageXOffset || document.documentElement.scrollLeft}px`;
    const parent = document.body;
    parent.appendChild(input);
    let ret = false;
    try {
        input.value = textString;
        selectText(input, 0, textString.length);
        ret = document.execCommand('copy');
        input.blur();
    } catch (e) {
        // noop;
    }
    parent.removeChild(input);
    return ret;
}

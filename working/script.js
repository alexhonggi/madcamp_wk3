(function ($) {
    "use strict";
    $(document).on('ready', function () {
        //get cursor's position
        $.fn.getCursorPosition = function () {
            var el = $(this).get(0);
            var pos = 0;
            if ('selectionStart' in el) {
                pos = el.selectionStart;
            } else if ('selection' in document) {
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
            return pos;
        };

        var origInput = $('.orig-text'),
            preview = $('.preview'),
            charCount = $('.char-count'),
            count = 0,
            nlCount = 0,
            origText = '',
            liveText = '',
            trText,
            prevText = '',
            caretPos = 0,
            livePos = 0,

            emptyText = function () {
                origText = liveText;
                caretPos = 0;
                count = 0;
                nlCount = 0;
                charCount.html(count);
                preview.html('<span class="caret"></span>');
            };

        //프리뷰 초기화
        emptyText();

        //키 입력 후마다 이벤트 리스너
        origInput.on('keyup', function () {
            liveText = $(this).val();
            livePos = $(this).getCursorPosition();

            //텍스트를 모두 지우면 프리뷰도 지우기
            if (liveText === '') {
                emptyText();
            }
            //입력 내용이 변화하거나 커서 위치가 바뀔 때마다 반영
            if (origText !== liveText || livePos !== caretPos) {
                trText = liveText.split('');
                prevText = '';
                trText.forEach(function (item, index) {
                    if (item === '\n') { //줄바꿈 처리
                        prevText += '<span class="nl"></span>';
                        nlCount += 1;
                    } else {
                        prevText += '<span>' + item + '</span>';
                    }
                    if (index + 1 === livePos) { //커서 위치 표시
                        prevText += '<span class="caret"></span>';
                    }
                });
                //원고지 미리보기에 반영
                preview.html(prevText);

                //글자 수 계산 (줄바꿈 제외)
                // count = trText.length - nlCount;
                // charCount.html(count);
                // nlCount = 0;

                //현재 상태를 저장
                origText = liveText;
                caretPos = livePos;
            }
        });
    });
}(jQuery));
export const MAIN_PATH = () => '/';
export const AUTH_PATH = () => '/auth'; // 로그인&회원가입
export const SEARCH_PATH = (searchWord) => `/search/${searchWord}`; // 검색
// export const USER_PATH = () => `/user/`; // 개인정보 (마이페이지)
export const USER_PATH = (userId) => `/user/${userId}`; // 개인정보 (마이페이지)
export const BOARD_PATH = () => '/board';   // 보드 기본
export const BOARD_DETAIL_PATH = (Seq) => `/board/detail/${Seq}`; // 보드 상세
export const BOARD_WRITE_PATH = () => '/board/write';   // 보드 글 작성
export const BOARD_UPDATE_PATH = (boardSeq) => `/board/update/${boardSeq}`; // 보드 수정
export const WBOARD_PATH = () => '/Wboard'; // 위스키 보드
export const WBOARD_WRITE_PATH = () => '/Wboard/write'; // 위스키 보드 작성
export const WBOARD_DETAIL_PATH = (WboardSeq) => `/Wboard/detail/${WboardSeq}`; // 위스키 보드 상세
export const WBOARD_UPDATE_PATH = (WboardSeq) => `/Wboard/update/${WboardSeq}`; // 위스키 보드 수정


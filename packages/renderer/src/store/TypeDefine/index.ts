export enum MediaType{
    IMAGE,
    VIDEO
}

enum RouterPath {
    BASE          = '/',
    MEDIA_CAPTURE = '/MediaCapture',
    MEDIA_LIBRARY = '/MediaLibrary',
    USER_LOGIN    = '/UserLogin',
    USER_REGISTER = '/UserRegister',
    USER_ZONE     = '/UserZone',
    SETTING       = '/Setting',
    MALL          = '/Mall',
}

export { RouterPath }
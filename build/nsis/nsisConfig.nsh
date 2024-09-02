!macro RemoveUserData
  SetShellVarContext current

  RMDir /r "$APPDATA\${PRODUCT_NAME}"
  !ifdef APP_PRODUCT_FILENAME
    RMDir /r "$APPDATA\${APP_PRODUCT_FILENAME}"
  !endif

!macroend

Section SecRemoveUserData
  !insertmacro RemoveUserData
SectionEnd
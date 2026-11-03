import { theme } from 'antd'
import { colors } from './colors'

export { colors }

export const antdTheme = {
  algorithm: theme.defaultAlgorithm, // الوضع الفاتح

  token: {
    // ===== الألوان الأساسية =====
    colorPrimary: colors.gold[600],
    colorInfo: colors.state.info,
    colorSuccess: colors.state.success,
    colorWarning: colors.state.warning,
    colorError: colors.state.error,

    // ===== الخلفيات =====
    colorBgBase: colors.surface.base,
    colorBgContainer: colors.surface.card,
    colorBgElevated: colors.surface.elevated,
    colorBgLayout: colors.surface.base,
    colorBgMask: 'rgba(0, 0, 0, 0.45)',

    // ===== النصوص =====
    colorText: colors.text.primary,
    colorTextSecondary: colors.text.secondary,
    colorTextTertiary: colors.text.disabled,
    colorTextQuaternary: colors.text.disabled,
    colorTextPlaceholder: colors.text.disabled,
    colorTextDisabled: colors.text.disabled,
    colorTextHeading: colors.black[800],
    colorTextLabel: colors.text.primary,
    colorTextDescription: colors.text.secondary,

    // ===== الحدود =====
    colorBorder: colors.surface.border,
    colorBorderSecondary: colors.surface.border,
    colorSplit: colors.surface.border,

    // ===== الحواف =====
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    borderRadiusXS: 4,

    // ===== الخطوط =====
    fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // ===== الظلال =====
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

    // ===== الحالات =====
    colorErrorOutline: 'rgba(255, 77, 79, 0.2)',
    colorWarningOutline: 'rgba(212, 160, 23, 0.2)',
    colorSuccessOutline: 'rgba(82, 196, 26, 0.2)',
    colorInfoOutline: 'rgba(22, 119, 255, 0.2)',
  },

  components: {
    // ===== Layout =====
    Layout: {
      headerBg: colors.black[900],        // الناف بار يبقى أسود
      bodyBg: colors.surface.base,         // خلفية الصفحة فاتحة
      siderBg: colors.black[900],
      triggerBg: colors.black[800],
      triggerColor: colors.text.onGold,
      headerHeight: 64,
      headerPadding: '0 24px',
      footerBg: colors.surface.elevated,
    },

    // ===== Menu =====
    Menu: {
      itemBg: colors.surface.card,
      itemSelectedBg: '#fafafa',
      itemSelectedColor: colors.gold[700],
      itemColor: colors.text.primary,
      itemHoverBg: '#fafafa',
      itemHoverColor: colors.gold[700],
      subMenuItemBg: colors.surface.card,
      groupTitleColor: colors.gold[700],
      itemHeight: 48,
      collapsedWidth: 80,
    },

    // ===== Button =====
    Button: {
      colorPrimary: colors.gold[600],
      primaryColor: colors.text.onGold, // نص أبيض فوق الذهبي

      // الزر الافتراضي
      defaultBg: '#ffffff',
      defaultColor: colors.text.primary,
      defaultBorderColor: colors.surface.border,
      defaultHoverBg: '#fafafa',
      defaultHoverColor: colors.gold[700],
      defaultHoverBorderColor: colors.gold[600],

      // الزر الخطر
      dangerColor: '#ffffff',
      dangerShadow: '0 2px 0 rgba(255, 77, 79, 0.1)',

      // أحجام
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      borderRadius: 8,
      borderRadiusLG: 10,
      borderRadiusSM: 6,

      // الزر الرابط
      colorLink: colors.gold[700],
      colorLinkHover: colors.gold[600],
    },

    // ===== Input =====
    Input: {
      colorBgContainer: '#ffffff',
      colorBorder: colors.surface.border,
      colorText: colors.text.primary,
      colorTextPlaceholder: colors.text.disabled,
      activeBorderColor: colors.gold[600],
      hoverBorderColor: colors.gold[500],
      activeShadow: '0 0 0 2px rgba(184, 134, 11, 0.15)',
      errorActiveShadow: '0 0 0 2px rgba(255, 77, 79, 0.15)',
      warningActiveShadow: '0 0 0 2px rgba(212, 160, 23, 0.15)',
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      borderRadius: 8,
      width: '100%',
    },

    // ===== InputNumber =====
    InputNumber: {
      colorBgContainer: '#ffffff',
      colorBorder: colors.surface.border,
      colorText: colors.text.primary,
      activeBorderColor: colors.gold[600],
      hoverBorderColor: colors.gold[500],
      handleBg: '#fafafa',
      handleActiveBg: '#f0f0f0',
      handleHoverColor: colors.gold[700],
      controlHeight: 36,
      width: '100%',
    },

    // ===== Select =====
    Select: {
      colorBgContainer: '#ffffff',
      colorBorder: colors.surface.border,
      colorText: colors.text.primary,
      colorTextPlaceholder: colors.text.disabled,
      optionSelectedBg: '#fafafa',
      optionSelectedColor: colors.gold[700],
      optionActiveBg: '#f5f5f5',
      optionActiveColor: colors.text.primary,
      controlHeight: 36,
      controlHeightLG: 44,
      controlHeightSM: 28,
      borderRadius: 8,
      borderRadiusLG: 10,
      borderRadiusSM: 6,
      width: '100%',
    },

    // ===== DatePicker =====
    DatePicker: {
      colorBgContainer: '#ffffff',
      colorBorder: colors.surface.border,
      colorText: colors.text.primary,
      colorTextPlaceholder: colors.text.disabled,
      activeBorderColor: colors.gold[600],
      hoverBorderColor: colors.gold[500],
      cellHoverBg: '#f5f5f5',
      cellActiveWithRangeBg: '#fafafa',
      controlHeight: 36,
      borderRadius: 8,
      width: '100%',
    },

    // ===== Table =====
    Table: {
      headerBg: '#fafafa',
      headerColor: colors.gold[700],
      headerSortActiveBg: '#f0f0f0',
      headerSortHoverBg: '#f0f0f0',
      rowHoverBg: '#fafafa',
      borderColor: colors.surface.border,
      colorText: colors.text.primary,
      colorTextSecondary: colors.text.secondary,
      footerBg: '#fafafa',
      footerColor: colors.text.primary,
      cellPaddingBlock: 12,
      cellPaddingInline: 16,
    },

    // ===== Modal =====
    Modal: {
      contentBg: colors.surface.card,
      headerBg: colors.surface.card,
      titleColor: colors.black[800],
      footerBg: colors.surface.card,
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
      borderRadiusLG: 12,
      titleFontSize: 18,
    },

    // ===== Drawer =====
    Drawer: {
      colorBgElevated: colors.surface.card,
      footerPaddingBlock: 16,
      footerPaddingInline: 24,
    },

    // ===== Card =====
    Card: {
      colorBgContainer: colors.surface.card,
      colorBorderSecondary: colors.surface.border,
      headerBg: colors.surface.card,
      headerFontSize: 16,
      borderRadiusLG: 12,
      paddingLG: 24,
    },

    // ===== Tabs =====
    Tabs: {
      itemColor: colors.text.secondary,
      itemSelectedColor: colors.gold[700],
      itemHoverColor: colors.gold[600],
      inkBarColor: colors.gold[600],
      titleFontSize: 15,
    },

    // ===== Form =====
    Form: {
      labelColor: colors.text.primary,
      labelFontSize: 14,
      itemMarginBottom: 20,
      verticalLabelPadding: '0 0 8px',
    },

    // ===== Switch =====
    Switch: {
      colorPrimary: colors.gold[600],
      colorPrimaryHover: colors.gold[500],
      handleBg: '#ffffff',
    },

    // ===== Checkbox =====
    Checkbox: {
      colorPrimary: colors.gold[600],
      colorPrimaryHover: colors.gold[500],
      colorBgContainer: '#ffffff',
      colorBorder: colors.surface.border,
    },

    // ===== Radio =====
    Radio: {
      colorPrimary: colors.gold[600],
      colorPrimaryHover: colors.gold[500],
      colorBgContainer: '#ffffff',
      colorBorder: colors.surface.border,
      buttonSolidCheckedBg: colors.gold[600],
      buttonSolidCheckedColor: colors.text.onGold,
    },

    // ===== Tag =====
    Tag: {
      defaultBg: '#fafafa',
      defaultColor: colors.text.primary,
    },

    // ===== Alert =====
    Alert: {
      colorInfoBg: 'rgba(22, 119, 255, 0.08)',
      colorInfoBorder: colors.state.info,
      colorSuccessBg: 'rgba(82, 196, 26, 0.08)',
      colorSuccessBorder: colors.state.success,
      colorWarningBg: 'rgba(212, 160, 23, 0.08)',
      colorWarningBorder: colors.state.warning,
      colorErrorBg: 'rgba(255, 77, 79, 0.08)',
      colorErrorBorder: colors.state.error,
    },

    // ===== Badge =====
    Badge: {
      colorError: colors.state.error,
      colorSuccess: colors.state.success,
      colorWarning: colors.state.warning,
      colorInfo: colors.state.info,
    },

    // ===== Pagination =====
    Pagination: {
      itemBg: '#ffffff',
      itemActiveBg: colors.gold[600],
      itemActiveColor: colors.text.onGold,
      itemLinkBg: '#ffffff',
      itemInputBg: '#ffffff',
    },

    // ===== Tooltip =====
    Tooltip: {
      colorBgSpotlight: colors.black[800],
      colorTextLightSolid: '#ffffff',
    },

    // ===== Dropdown =====
    Dropdown: {
      colorBgElevated: colors.surface.card,
      controlItemBgHover: '#f5f5f5',
      controlItemBgActive: '#fafafa',
      colorText: colors.text.primary,
    },
  },
}
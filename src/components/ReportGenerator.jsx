import React, { useState, useMemo, useEffect } from 'react';
import {
  Table, Input, Select, Button, Tooltip, Pagination,
  DatePicker, Modal, Checkbox,
} from 'antd';
import {
  SearchOutlined, PrinterOutlined, FileExcelOutlined, ReloadOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import * as XLSX from "xlsx";
import dayjs from 'dayjs';
import { createStyles } from 'antd-style';
import '../styles/ReportGenerator.css';
// import notify from '../lib/notify'


const { RangePicker } = DatePicker;

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
          }
        }
      }
    `,
  };
});

const companyInfo = {
  nameAr: "شركة التميمي",
  nameEn: "Altamimi IT Solutions Co.",
  addressAr: "الرياض - السعودية",
  addressEn: "Riyadh - Saudi Arabia",
  phone: "+967775294208",
  taxNumber: "300123456789",
  commercialRegister: "1010234567",
  website: "www.altamimi.com",
};

const ReportGenerator = ({
  columns = [],
  data = [],
  dataSource,
  loading = false,
  rowKey = 'id',
  title,
  searchable = true,
  searchPlaceholder = 'بحث...',
  searchFields,
  onSearch,
  filters,
  filterValues = {},
  onFilterChange,
  sortable = true,
  onSortChange,
  defaultSort,
  showPrintButtons = true,
  printTitle = 'تقرير',
  printFileName = 'report',
  onPrint,
  onExportExcel,
  disablePrint = false,
  pagination = { pageSize: 10 },
  showPagination = true,
  className = '',
  size = 'middle',
  bordered = false,
  onRowClick,
  rowClassName,
  emptyText = 'لا توجد بيانات',
  toolbarClassName = '',
  showReload = false,
  onReload,
  extraActions,
  selection,
  showDateFilter = false,
  onDateFilterChange,
  fixedColumns = null,
}) => {
  const { styles } = useStyle();

  const rows = (data && data.length > 0) ? data : (dataSource || []);

  
  const [searchText, setSearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(filterValues || {});
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 15);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState(null);

  // ✅ state للترتيب
  const [sortField, setSortField] = useState(defaultSort?.field || null);
  const [sortDirection, setSortDirection] = useState(defaultSort?.direction || null);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedExportKeys, setSelectedExportKeys] = useState([]);

  // ===== فلترة + ترتيب =====
  const filteredData = useMemo(() => {
    let result = [...rows];

    // بحث
    if (searchable && searchText && searchText.trim()) {
      const searchLower = searchText.trim().toLowerCase();
      result = result.filter((row) => {
        if (searchFields && searchFields.length > 0) {
          return searchFields.some((field) => {
            const value = row[field];
            return value != null && String(value).toLowerCase().includes(searchLower);
          });
        }
        return Object.entries(row).some(([key, value]) => {
          if (key === 'actions') return false;
          if (value === null || value === undefined) return false;
          if (typeof value === 'object') return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    // فلاتر
    if (filters && Object.keys(selectedFilters).length > 0) {
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          result = result.filter((row) => {
            const rowValue = row[key];
            if (Array.isArray(value)) return value.includes(rowValue);
            return rowValue === value;
          });
        }
      });
    }

    // فلتر التاريخ
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      result = result.filter((row) => {
        const date = row.createdAt || row.date || row.created_date;
        if (!date) return true;
        const d = dayjs(date);
        return d.isAfter(start) && d.isBefore(end);
      });
    }


    if (sortField && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal ?? '').toLowerCase();
        const bStr = String(bVal ?? '').toLowerCase();
        return sortDirection === 'asc'
          ? aStr.localeCompare(bStr, 'ar')
          : bStr.localeCompare(aStr, 'ar');
      });
    }

    return result;
  }, [rows, searchText, selectedFilters, filters, searchFields, searchable, dateRange, sortField, sortDirection]);

  // ===== paginatedData =====
  const paginatedData = useMemo(() => {
    if (!showPagination || pageSize === 999999 || pageSize >= filteredData.length) {
      return filteredData;
    }
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize, showPagination]);


  const tableKey = `${filteredData.length}-${searchText}-${currentPage}-${pageSize}-${sortField}-${sortDirection}`;


  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedFilters, dateRange]);

  const getReportData = () => (filteredData.length > 0 ? filteredData : rows);

  const exportableColumns = useMemo(() => {
    return columns.filter(
      (col) => col.key !== 'actions' && col.label !== 'الإجراءات' && col.label !== 'Actions'
    );
  }, [columns]);

  const openExportModal = () => {
    setSelectedExportKeys(exportableColumns.map((c) => c.key));
    setExportModalOpen(true);
  };

  const pickedColumns = useMemo(() => {
    return exportableColumns.filter((c) => selectedExportKeys.includes(c.key));
  }, [exportableColumns, selectedExportKeys]);

  const showAlert = (text) => alert(text);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (onDateFilterChange) onDateFilterChange(dates);
  };

  const handleRefresh = async () => {
    setCurrentPage(1);
    if (onReload) {
      try { await onReload(); } catch {}
    }
  };

  // ============ الطباعة ============
  const doPrint = () => {
    if (onPrint) { onPrint(); return; }

    const reportData = getReportData();
    if (reportData.length === 0) return showAlert('لا توجد بيانات للطباعة');
    if (pickedColumns.length === 0) return showAlert('اختر عموداً واحداً على الأقل');

    const numColumns = pickedColumns.length;
    const isLandscape = numColumns > 6;

    let fontSize = '10px';
    let headerFontSize = '12px';
    if (numColumns <= 5) { fontSize = '12px'; headerFontSize = '14px'; }
    else if (numColumns <= 8) { fontSize = '10px'; headerFontSize = '12px'; }
    else if (numColumns <= 12) { fontSize = '8px'; headerFontSize = '10px'; }
    else { fontSize = '7px'; headerFontSize = '9px'; }

    const dateRangeText = dateRange
      ? `من ${dateRange[0].format('YYYY/MM/DD')} إلى ${dateRange[1].format('YYYY/MM/DD')}`
      : '';

    const tableRows = reportData.map((row) => {
      const cells = pickedColumns.map((col) => {
        let value = row[col.key];
        if (col.formatter) value = col.formatter(value, row);
        return `<td>${value ?? '-'}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>${printTitle || title || ''}</title>
        <meta charset="UTF-8">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page { size: ${isLandscape ? 'landscape' : 'portrait'}; margin: 6mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Cairo', 'Tajawal', sans-serif; direction: rtl; background: white; font-size: ${fontSize}; }
          .header { display: flex; justify-content: space-between; padding: 4px 8px; border: 1.5px solid #197fdd; border-radius: 4px; margin-bottom: 4px; }
          .header-right { text-align: right; flex: 1; }
          .header-center { text-align: center; flex: 1; }
          .header-left { text-align: left; direction: ltr; flex: 1; }
          .company-name-ar { font-size: ${parseInt(fontSize) + 4}px; font-weight: bold; color: #2c3e50; }
          .company-name-en { font-size: ${parseInt(fontSize) + 4}px; font-weight: bold; color: #2c3e50; }
          .info-text { font-size: ${parseInt(fontSize) - 1}px; margin-top: 1px; color: #495057; }
          .title-box { text-align: center; background: #f8f9fa; border: 1.5px solid #197fdd; border-radius: 4px; padding: 4px; font-size: ${parseInt(fontSize) + 8}px; font-weight: bold; margin: 4px 0; }
          .date-range { text-align: center; font-size: ${parseInt(fontSize) + 1}px; color: #495057; margin: 2px 0 4px 0; font-weight: bold; }
          .report-table { width: 100%; border-collapse: collapse; font-size: ${fontSize}; table-layout: auto; }
          .report-table th, .report-table td { border: 1px solid #c5ccd1; padding: 3px 5px; text-align: center; white-space: nowrap; }
          .report-table th { background: #197fdd; color: white; font-weight: bold; font-size: ${headerFontSize}; padding: 4px 6px; }
          .report-table tr:nth-child(even) { background: #f8f9fa; }
          .footer { text-align: center; font-size: ${parseInt(fontSize) - 1}px; color: #6c757d; border-top: 1px solid #c5ccd1; padding-top: 4px; margin-top: 6px; }
          @media print {
            body { padding: 0; margin: 0; }
            .header, .title-box, .report-table th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .report-table tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-right">
            <div class="company-name-ar">${companyInfo.nameAr}</div>
            <div class="info-text">${companyInfo.addressAr}</div>
            <div class="info-text">الرقم الضريبي: ${companyInfo.taxNumber}</div>
            <div class="info-text">السجل التجاري: ${companyInfo.commercialRegister}</div>
            <div class="info-text">الهاتف: ${companyInfo.phone}</div>
          </div>
          <div class="header-center"><div class="info-text">${companyInfo.website}</div></div>
          <div class="header-left">
            <div class="company-name-en">${companyInfo.nameEn}</div>
            <div class="info-text">${companyInfo.addressEn}</div>
            <div class="info-text">Tax Number: ${companyInfo.taxNumber}</div>
            <div class="info-text">Phone: ${companyInfo.phone}</div>
          </div>
        </div>
        <div class="title-box">${printTitle || title || 'تقرير'}</div>
        ${dateRangeText ? `<div class="date-range">${dateRangeText}</div>` : ''}
        <table class="report-table">
          <thead><tr>${pickedColumns.map(col => `<th>${col.label}</th>`).join('')}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <div class="footer">
          <div>تاريخ الطباعة: ${new Date().toLocaleDateString("ar-SA")}</div>
          <div>تم الإنشاء بواسطة نظام Attlsoft ERP</div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 300);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) {
      const blob = new Blob([printContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          setTimeout(() => {
            newWindow.print();
            setTimeout(() => newWindow.close(), 500);
          }, 300);
        };
      }
      return;
    }
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // ============ الإكسل ============
  const doExcel = () => {
    if (onExportExcel) { onExportExcel(); return; }

    const reportData = getReportData();
    if (reportData.length === 0) return showAlert('لا توجد بيانات للتصدير');
    if (pickedColumns.length === 0) return showAlert('اختر عموداً واحداً على الأقل');

    const excelData = [];
    excelData.push(["", companyInfo.nameAr, printTitle || title || '', companyInfo.nameEn, ""]);
    excelData.push([]);
    excelData.push(pickedColumns.map(c => c.label));

    reportData.forEach(row => {
      const rowData = pickedColumns.map(col => {
        let value = row[col.key];
        if (col.formatter) value = col.formatter(value, row);
        return value ?? "-";
      });
      excelData.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    ws['!cols'] = pickedColumns.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "تقرير");
    XLSX.writeFile(wb, `${printFileName || printTitle || title || 'report'}.xlsx`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (onSearch) onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    if (onFilterChange) onFilterChange({});
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // ===== أعمدة antd — ترتيب controlled + عمود واحد ثابت =====
  const antColumns = useMemo(() => {
    return columns.map((col, index) => {
      const isActionsColumn = col.key === 'actions' || col.label === 'الإجراءات' || col.label === 'Actions';
      const canSort = col.sortable !== false && sortable && !isActionsColumn;

      let fixed = undefined;
      if (isActionsColumn || index === 0) {
        fixed = 'start';
      }


      let sortOrder = null;
      if (sortField === col.key && sortDirection) {
        sortOrder = sortDirection === 'asc' ? 'ascend' : 'descend';
      }

      return {
        title: col.label,
        dataIndex: col.key,
        key: col.key,
        align: col.align || 'center',
        width: col.width || 150,
        fixed,
        sortOrder,
        render: (value, record, index) => {
          if (col.render) return col.render(value, record, index);
          if (col.formatter) return col.formatter(value, record);
          return value ?? '-';
        },
        sorter: canSort ? true : undefined,
        sortDirections: canSort ? ['ascend', 'descend'] : [],
      };
    });
  }, [columns, sortable, sortField, sortDirection]);

  // ============ Toolbar ============
  const renderToolbar = () => {
    const hasSearch = searchable && !disablePrint;
    const hasFilters = filters && Object.keys(filters).length > 0 && !disablePrint;
    const hasExport = showPrintButtons && !disablePrint;

    return (
      <div className={`rg-toolbar ${toolbarClassName}`}>
        {/* اليسار: بحث + تصدير + رفرش */}
         {extraActions && (
        <div className="rg-toolbar-extra">
          {extraActions}
        </div>
      )}
        <div className="rg-toolbar-left">
          <Tooltip title="تحديث">
            <Button
              className="rg-icon-btn rg-refresh-btn"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              shape="circle"
            />
          </Tooltip>
          {hasExport && (
            <Tooltip title="تصدير">
              <Button
                className="rg-icon-btn rg-export-btn"
                icon={<ExportOutlined />}
                onClick={openExportModal}
                shape="circle"
              />
            </Tooltip>
          )}

          
          {hasSearch && (
            <Input
              className="rg-search"
              placeholder={searchPlaceholder}
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              size="middle"
            />
          )}

          

          {showDateFilter && (
            <RangePicker
              onChange={handleDateChange}
              placeholder={['من تاريخ', 'إلى تاريخ']}
              className="w-56"
              size="middle"
              format="YYYY/MM/DD"
            />
          )}

          {hasFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(filters).map(([key, options]) => (
                <Select
                  key={key}
                  placeholder={key}
                  allowClear
                  className="w-36"
                  size="middle"
                  onChange={(value) => handleFilterChange(key, value)}
                  value={selectedFilters[key]}
                >
                  {options.map((opt) => (
                    <Select.Option key={String(opt.value)} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              ))}
              {Object.keys(selectedFilters).some(k => selectedFilters[k] !== undefined && selectedFilters[k] !== null && selectedFilters[k] !== '') && (
                <Button size="middle" onClick={handleClearFilters}>مسح الفلاتر</Button>
              )}
            </div>
          )}

          
        </div>

        {/* اليمين: عدد الصفوف + الإجمالي */}
        <div className="rg-toolbar-right">
          <span className="rg-rows-label"> الصفوف:</span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="rg-rows-select"
            size="middle"
            popupMatchSelectWidth={false}
          >
            <Select.Option value={10}>10</Select.Option>
            <Select.Option value={20}>20</Select.Option>
            <Select.Option value={50}>50</Select.Option>
            <Select.Option value={100}>100</Select.Option>
            <Select.Option value={999999}>الكل</Select.Option>
          </Select>

          <span className="rg-total">
            الإجمالي: <strong>{filteredData.length}</strong>
          </span>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (!showPagination) return null;
    if (pageSize === 999999) return null;
    const total = filteredData.length;
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    return (
      <div className="rg-pagination-wrap">
        <Pagination
          current={currentPage}
          total={total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper={false}
          showTotal={false}
          className="rtl-pagination"
        />
      </div>
    );
  };

  const allChecked = pickedColumns.length === exportableColumns.length && exportableColumns.length > 0;
  const someChecked = pickedColumns.length > 0 && !allChecked;

  const toggleAll = (checked) => {
    setSelectedExportKeys(checked ? exportableColumns.map(c => c.key) : []);
  };

  return (
    <div className={`report-generator ${className}`} dir="rtl">
      {renderToolbar()}

      <div className="rg-table-card">
        <Table
          key={tableKey}
          className={styles.customTable}
          columns={antColumns}
          dataSource={paginatedData}
          loading={loading}
          rowKey={rowKey}
          size={size}
          bordered={bordered}
          pagination={false}
          locale={{ emptyText }}
          rowSelection={selection ? {
            selectedRowKeys: selection.selectedRowKeys,
            onChange: selection.onChange,
            type: selection.type || 'checkbox',
          } : undefined}
          scroll={{ x: 'max-content', y: 55 * 5 }}
          onChange={(pag, filtersArg, sorter) => {
            if (sorter && sorter.order && sorter.field) {
              setSortField(sorter.field);
              setSortDirection(sorter.order === 'ascend' ? 'asc' : 'desc');
              if (onSortChange) onSortChange(sorter.field, sorter.order === 'ascend' ? 'asc' : 'desc');
            } else {
              setSortField(null);
              setSortDirection(null);
              if (onSortChange) onSortChange(null, null);
            }
          }}
          onRow={(record) => ({
            onClick: () => onRowClick?.(record),
            className: rowClassName?.(record, filteredData.indexOf(record)) || '',
          })}
        />
      </div>

      {renderPagination()}

      <Modal
        open={exportModalOpen}
        onCancel={() => setExportModalOpen(false)}
        title="تصدير التقرير"
        footer={null}
        width={520}
        destroyOnClose
        className="rg-export-modal"
      >
        <div>
          <div style={{ marginBottom: 12, fontWeight: 600, color: '#555' }}>
            اختر الأعمدة التي تريد تصديرها:
          </div>

          <div className="rg-columns-box">
            <div className="rg-columns-header">
              <label className="rg-native-check-label rg-native-check-all">
  <input
    type="checkbox"
    className="rg-native-check"
    checked={allChecked}
    ref={(el) => {
      if (el) el.indeterminate = someChecked;
    }}
    onChange={(e) => toggleAll(e.target.checked)}
  />
  <span className="rg-native-check-text">
    <strong>تحديد الكل</strong>
  </span>
</label>
            </div>

            <div className="rg-columns-list">
  {exportableColumns.map((col) => (
    <div key={col.key} className="rg-column-item">
      <label className="rg-native-check-label">
        <input
          type="checkbox"
          className="rg-native-check"
          checked={selectedExportKeys.includes(col.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedExportKeys(prev => [...prev, col.key]);
            } else {
              setSelectedExportKeys(prev => prev.filter(k => k !== col.key));
            }
          }}
        />
        <span className="rg-native-check-text">{col.label}</span>
      </label>
    </div>
  ))}
</div>
          </div>

          <div className="rg-modal-actions">
            <Button onClick={() => setExportModalOpen(false)}>إلغاء</Button>
            <Button
              className="rg-btn-excel"
              icon={<FileExcelOutlined />}
              onClick={() => { doExcel(); setExportModalOpen(false); }}
              disabled={pickedColumns.length === 0}
            >
              تصدير Excel
            </Button>
            <Button
              className="rg-btn-print"
              icon={<PrinterOutlined />}
              onClick={() => { doPrint(); setExportModalOpen(false); }}
              disabled={pickedColumns.length === 0}
            >
              طباعة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportGenerator;
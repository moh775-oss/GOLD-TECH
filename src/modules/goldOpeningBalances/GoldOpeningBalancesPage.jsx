import { useEffect, useState, useCallback, useMemo } from 'react'
import { Card, Select, Button, DatePicker, Row, Col } from 'antd'
import { PlusOutlined, ClearOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import DataTable from '../../components/ReportGenerator.jsx'
import notify from '../../lib/notify.jsx'
import { goldOpeningBalancesApi } from './goldOpeningBalancesApi.jsx'
import GoldOpeningBalanceModal from './GoldOpeningBalanceModal.jsx'
import GoldOpeningBalanceViewModal from './GoldOpeningBalanceViewModal.jsx'
import { buildGoldOpeningBalanceColumns } from './goldOpeningBalancesConfig.jsx'

const getDefaultDateRange = () => ({
    from: dayjs().startOf('month').format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
})

export default function GoldOpeningBalancesPage() {
    const [data, setData] = useState([])
    const [optionsData, setOptionsData] = useState({
        branches: [],
        stores: [],
        karats: [],
    })
    const [formOpen, setFormOpen] = useState(false)
    const [viewOpen, setViewOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [viewing, setViewing] = useState(null)
    const [loading, setLoading] = useState(false)

    const [filters, setFilters] = useState(() => ({
        store_id: undefined,
        karat_id: undefined,
        ...getDefaultDateRange(),
    }))

    useEffect(() => {
        ; (async () => {
            try {
                const res = await goldOpeningBalancesApi.options()
                if (res.data?.success) {
                    setOptionsData(res.data.data || {})
                }
            } catch (e) {
                console.error(e)
            }
        })()
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const params = {}
            if (filters.store_id) params.store_id = filters.store_id
            if (filters.karat_id) params.karat_id = filters.karat_id
            if (filters.from) params.from = dayjs(filters.from).format('YYYY-MM-DD')
            if (filters.to) params.to = dayjs(filters.to).format('YYYY-MM-DD')

            const res = await goldOpeningBalancesApi.list(params)
            if (res.data.success) setData(res.data.data || [])
            else notify.error(res.data.message)
        } catch (e) {
            notify.error(e.response?.data?.message || 'فشل الجلب')
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const openCreate = () => {
        setEditing(null)
        setFormOpen(true)
    }

    const openEdit = (row) => {
        setEditing(row)
        setFormOpen(true)
    }

    const openView = (row) => {
        setViewing(row)
        setViewOpen(true)
    }

    const onDelete = async (row) => {
        try {
            const res = await goldOpeningBalancesApi.remove(row.id)
            if (res.data.success) {
                notify.success(res.data.message)
                fetchData()
            } else notify.error(res.data.message)
        } catch (e) {
            notify.error(e.response?.data?.message || 'فشل الحذف')
        }
    }

    const onSaved = () => {
        setFormOpen(false)
        fetchData()
    }

    const resetFilters = () =>
        setFilters({
            store_id: undefined,
            karat_id: undefined,
            ...getDefaultDateRange(),
        })

    const columns = useMemo(
        () => buildGoldOpeningBalanceColumns({ onEdit: openEdit, onDelete, onView: openView }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const defaults = getDefaultDateRange()
    const hasFilters = Boolean(
        filters.store_id ||
        filters.karat_id ||
        (filters.from && filters.from !== defaults.from) ||
        (filters.to && filters.to !== defaults.to)
    )

    return (
        <div style={{ padding: 24 }}>
            <Card>
                <div className="page-header-banner" >
                    رصيد افتتاحي
                </div>
                <div className="items-filters" style={{ marginBottom: 16 }}>
                    <Row gutter={[8, 8]}>
                        <Col xs={12} md={6}>
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                placeholder="الخزينة"
                                style={{ width: '100%' }}
                                value={filters.store_id}
                                onChange={(v) => setFilters({ ...filters, store_id: v })}
                                options={(optionsData.stores || []).map((s) => ({ value: s.id, label: s.name }))}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <Select
                                allowClear
                                placeholder="العيار"
                                style={{ width: '100%' }}
                                value={filters.karat_id}
                                onChange={(v) => setFilters({ ...filters, karat_id: v })}
                                options={(optionsData.karats || []).map((k) => ({ value: k.id, label: k.name }))}
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <DatePicker
                                placeholder="من تاريخ"
                                style={{ width: '100%' }}
                                value={filters.from ? dayjs(filters.from) : null}
                                onChange={(d) =>
                                    setFilters({ ...filters, from: d ? d.format('YYYY-MM-DD') : undefined })
                                }
                            />
                        </Col>
                        <Col xs={12} md={6}>
                            <DatePicker
                                placeholder="إلى تاريخ"
                                style={{ width: '100%' }}
                                value={filters.to ? dayjs(filters.to) : null}
                                onChange={(d) =>
                                    setFilters({ ...filters, to: d ? d.format('YYYY-MM-DD') : undefined })
                                }
                            />
                        </Col>
                        {hasFilters && (
                            <Col xs={12} md={6}>
                                <Button
                                    icon={<ClearOutlined />}
                                    onClick={resetFilters}
                                    size="small"
                                    danger
                                    style={{ width: '100%' }}
                                >
                                    مسح الفلاتر
                                </Button>
                            </Col>
                        )}
                    </Row>
                </div>

                <DataTable
                    title="الرصيد الافتتاحي للذهب"
                    columns={columns}
                    data={data}
                    loading={loading}
                    searchable
                    searchPlaceholder="بحث برقم المستند أو البيان"
                    showReload
                    onReload={fetchData}
                    extraActions={
                        <button
                            onClick={openCreate}
                            style={{
                                background: 'linear-gradient(135deg, #d4a017, #b8860b)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '8px 16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(212, 160, 23, 0.35)',
                            }}
                        >
                            <PlusOutlined /> إضافة رصيد افتتاحي
                        </button>
                    }
                />
            </Card>

            <GoldOpeningBalanceModal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                editingRecord={editing}
                optionsData={optionsData}
                onSuccess={onSaved}
            />

            <GoldOpeningBalanceViewModal
                open={viewOpen}
                onClose={() => setViewOpen(false)}
                record={viewing}
            />
        </div>
    )
}
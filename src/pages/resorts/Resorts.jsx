import React from 'react'
import { ActionIcon, Autocomplete, Button, Chip, Modal, NumberInput, Pagination, Select, Tabs, TextInput, Textarea } from '@mantine/core'
import { pb } from 'shared/api'
import { Image } from 'shared/ui'
import { BomjCard, ResortCard } from 'widgets'
import { ResortSlider } from 'pages/resort/ui/mainSection/ResortSlider'
// import { useSearchParams } from 'react-router-dom'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { openConfirmModal } from '@mantine/modals'

import { MdDelete } from 'react-icons/md'

async function getResorts (page, list) {
  return await pb.collection('resorts').getList(page, 12, {
    filter: `status = '${list ? 'bomj' : 'good'}'`
  })
}

async function getRegionsAndDiseases () {
  let regions = []
  let diseases = []
  
  await pb.collection('utils').getOne('111111111111111')
  .then((res) => {
    regions = res.regions ?? [], 
    diseases = res.diseases ?? []
  })

  return {
    regions, 
    diseases
  }
}

export const Resorts = () => {

  const [shitModal, setShitModal] = React.useState(false)
  const [modal, setModal] = React.useState(false)

  const [regions, setRegions] = React.useState([])
  const [diseases, setDiseases] = React.useState([])

  const [tab, setTab] = React.useState('list')

  const [resorts, setResorts] = React.useState({})

  function handleResorts (page) {
    getResorts(page, tab === 'list' ? true : false)
    .then(res => {
      setResorts(res)
    })
  }

  React.useEffect(() => {
    handleResorts(1)
    getRegionsAndDiseases()
    .then(res => {
      setRegions(res.regions)
      setDiseases(res.diseases)
    })

    pb.collection('resorts').subscribe('*', () => handleResorts(resorts?.page ?? 1)) 
  }, [])

  React.useEffect(() => {
    handleResorts(1)
  }, [tab])

  const [shit, setShit] = React.useState({
    title: '',
    adress: '',
    region: '',
    diseas: '',
  })

  const [resort, setResort] = React.useState({
    title: '',
    adress: '',
    region: '',
    diseas: '',
    cost: '',
    duration: '',
    tags: [],
    description: ''
  })

  function handleResortChange (val, name) {
    setResort({...resort, [name]: val})
  }

  const [tag, setTag] = React.useState('')

  function handleTagChange (val) {
    setTag(val)
  }

  function addTag () {
    setResort({...resort, tags: [...resort.tags, tag]})
    setTag('')
  }

  function handleTagClick (index) {
    setResort({...resort, tags: resort.tags.filter((_, i) => i != index)})
  }

  const [images, setImages] = React.useState({})

  function handleImageChange (val, index) {
    setImages({...images, [index]: val})
  }

  function handleImageDelete (index) {
    setImages({...images, [index]: null})
  }

  async function createBomjResort () {
    await pb.collection('resorts').create({
      ...shit, 
      status: 'bomj'
    })
  }

  async function createGoodResort () {
    await pb.collection('resorts').create({
      ...resort, 
      status: 'good'
    })
    .then(async res => {
      for (const index in images) {
        if (!isNaN(index)) {
          if (images?.[index] instanceof File) {
            const formData = new FormData()
            formData.append([`${index}`], images?.[index])
            await pb.collection('resorts').update(res.id, formData)
            .then(res => {
              console.log(res);
            })
          }
        }
      }
    })
  }
  
  const [preview, setPreview] = React.useState({})

  React.useEffect(() => {
    setPreview({
      ...resort, 
      [1]: images?.[1]
    })
  }, [resort, images])

  async function deleteResort (resortId) {
    await pb.collection('resorts').delete(resortId)
  }

  function deleteConfirm (id) {
    openConfirmModal({
      title: 'Подтверждение удаление',
      centered: true,
      labels: {confirm: 'Удалить', cancel: 'Отмена'},
      onConfirm: () => deleteResort(id)
    })
  }

  const [filteredRegions, setFilteredRegions] = React.useState('')
  const [filteredDiseases, setFilteredDiseases] = React.useState('')

  function filterByRegions () {
    
  }

  return (
    <>
      <div className='w-full'>
        <div className='space-x-4'>
          <Button
            onClick={() => setShitModal(true)}
          >
            Добавить обычный курорт
          </Button>
          <Button
            onClick={() => setModal(true)}
          >
            Добавить курорт
          </Button>
        </div>
        <Tabs
          className='mt-4'
          value={tab}
          onTabChange={setTab}
        >
          <Tabs.List grow>
            <Tabs.Tab value='list'>Список курортов</Tabs.Tab>
            <Tabs.Tab value='resorts'>Курорты</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='list' p={'md'}>
            <div className='flex items-center justify-end gap-2'>
              <Select
                data={regions}
                label='По областям'
              />
              <Select
                data={diseases}
                label='По болезням'
              />
            </div>
            <div className='space-y-4 flex flex-col items-center mt-4'>
              {resorts?.items?.map((resort, i) => {
                return (
                  <div 
                    key={i}
                    className='flex gap-2'
                  >
                    <BomjCard resort={resort} />
                    <ActionIcon
                      color='red'
                      size='md'
                      onClick={() => deleteConfirm(resort?.id)}
                    >
                      <MdDelete/>
                    </ActionIcon>
                  </div>
                )
              })}
            </div>
            <div className='mt-5 flex justify-center'>
              <Pagination
                value={resorts?.page}
                onChange={e => handleResorts(e)}
                total={resorts?.totalPages}
              />
            </div>
          </Tabs.Panel>
          <Tabs.Panel value='resorts' p={'md'}>
            <div className='grid grid-cols-4'>
              {resorts?.items?.map((resort, i) => {
                return (
                  <ResortCard resort={resort} key={i} deleteable handleDelete={deleteConfirm}/>
                )
              })}
            </div>
            <div className='mt-5 flex justify-center'>
              <Pagination
                value={resorts?.page}
                onChange={e => handleResorts(e)}
                total={resorts?.totalPages}
              />
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
      <Modal
        opened={shitModal}
        onClose={() => setShitModal(false)}
        centered
        title='Добавление курорта'
      >
        <div className='space-y-4'>
          <TextInput
            label='Название'
            value={shit.title ?? ''}
            onChange={e => setShit({...shit, title: e.target.value})}
          />
          <Select
            data={regions}
            label='Область'
            dropdownPosition='bottom'
            searchable
            value={shit.region ?? ''}
            onChange={e => setShit({...shit, region: e})}
          />
          <Select
            data={diseases}
            label='Заболевание'
            dropdownPosition='bottom'
            searchable
            value={shit.diseas ?? ''}
            onChange={e => setShit({...shit, diseas: e})}
          />
          <TextInput
            label='Адрес'
            value={shit.adress ?? ''}
            onChange={e => setShit({...shit, adress: e.target.value})}
          />
        </div>
        <div className='mt-5'>
          <Button
            onClick={createBomjResort}
          >
            Добавить курорт
          </Button>
        </div>
      </Modal>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        centered
        title='Добавление курорта'
        fullScreen
      >
        <div className='grid grid-cols-3'>
          <div/>
          <div className='max-w-sm'>
            <TextInput
              label='Название'
              value={resort.title ?? ''}
              onChange={e => handleResortChange( e.currentTarget.value, 'title')}
            />
            <Select
              data={regions}
              label='Область'
              value={resort.region ?? ''}
              onChange={e => handleResortChange(e, 'region')}
            />
            <Select
              data={diseases}
              label='Заболевание'
              value={resort.diseas ?? ''}
              onChange={e => handleResortChange(e, 'diseas')}
            />
            <TextInput
              label='Адрес'
              value={resort.adress ?? ''}
              onChange={e => handleResortChange( e.currentTarget.value, 'adress')}
            />
            <NumberInput
              label='Длительность'
              value={resort.duration ?? ''}
              onChange={e => handleResortChange(e, 'duration')}
            />
            <NumberInput
              label='Стоимость'
              value={resort.cost ?? ''}
              onChange={e => handleResortChange(e, 'cost')}
            />

            <div className='flex gap-4 flex-wrap'>
              {resort?.tags?.map((tag, i) => {
                return (
                  <Chip 
                    key={i} 
                    checked 
                    onClick={() => handleTagClick(i)}
                  >
                    {tag}
                  </Chip>
                )
              })}
            </div>
            <div className='flex max-w-[250px] items-end'> 
              <TextInput 
                label='Теги'
                value={tag}
                onChange={e => handleTagChange(e.currentTarget.value)}
              />
              <Button
                onClick={addTag}
              >
                Добавить
              </Button>
            </div>
          </div>
          <div className=''>
            <ResortCard
              resort={preview}
            />
          </div>
        </div>
        <Image
          image={images?.['1']}
          onChange={handleImageChange}
          label={'Главное фото'}
          index={1}
          onDelete={handleImageDelete}
          // record={''}
        />
        <div className='grid grid-cols-5 gap-6'>
          {Array(10).fill(1).map((_, i) => {

            const index = i + 2

            return (
              <Image
                image={images?.[index]}
                onChange={handleImageChange}
                label={`Фото ${i + 1}`}
                index={index}
                onDelete={handleImageDelete}
                key={i}
                className={'!w-60'}
              />
            )
          })}
        </div>
        <div className='max-w-[750px] mx-auto mt-5'>
          <ReactQuill 
            value={resort?.description ?? ''}
            onChange={e => handleResortChange(e, 'description')} 
            className='h-full'
          />
        </div>
        
        <div className='mt-5'>
          <Button
            onClick={createGoodResort}
          >
            Добавить курорт
          </Button>
        </div>
      </Modal>
    </>
  )
}
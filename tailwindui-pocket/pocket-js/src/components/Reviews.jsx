'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { useInView } from 'framer-motion'

import { Container } from '@/components/Container'

const reviews = [
  {
    title: 'Atendimento maravilhoso!',
    body: 'Comprei um produto e tive dúvidas sobre a instalação. O suporte me ajudou em minutos! Incrível!',
    author: 'Roberto Almeida',
    rating: 5,
  },
  {
    title: 'Produto de qualidade!',
    body: 'Recebi minha encomenda hoje e a qualidade do material me surpreendeu. Superou minhas expectativas.',
    author: 'Juliana Costa',
    rating: 5,
  },
  {
    title: 'Melhor compra do ano.',
    body: 'Fiz um investimento em um eletrodoméstico e valeu cada centavo. A família toda está amando!',
    author: 'Daniela Menezes',
    rating: 5,
  },
  {
    title: 'Recomendo muito!',
    body: 'Contratei a empresa para um serviço em minha casa e a equipe foi extremamente profissional. Estou satisfeito.',
    author: 'Marcos Ribeiro',
    rating: 5,
  },
  {
    title: 'Entrega antes do prazo.',
    body: 'Fiz a compra pensando que demoraria semanas, mas chegou em apenas 3 dias. Fantástico!',
    author: 'Carolina Santos',
    rating: 5,
  },
  {
    title: 'Experiência maravilhosa.',
    body: 'Desde o momento da compra até a entrega, tudo foi perfeito. Atendimento de primeira.',
    author: 'Gustavo Lima',
    rating: 5,
  },
  {
    title: 'Produto inovador.',
    body: 'Comprei um gadget novo e ele tem facilitado muito minha rotina. Recomendo a todos os meus amigos.',
    author: 'Beatriz Oliveira',
    rating: 5,
  },
  {
    title: 'Eficácia no serviço.',
    body: 'Contratei um serviço de jardinagem e o resultado final foi espetacular. Minha casa parece nova!',
    author: 'Felipe Cardoso',
    rating: 5,
  },
  {
    title: 'Melhor presente.',
    body: 'Comprei um item para presentear minha mãe e ela amou. Agradeço pela qualidade.',
    author: 'Camila Ferreira',
    rating: 5,
  },
  {
    title: 'Super prático.',
    body: 'Adquiri um produto que tem facilitado meu dia a dia. Fiquei surpreso com a eficiência.',
    author: 'Rodrigo Soares',
    rating: 5,
  },
  {
    title: 'Desconto incrível.',
    body: 'Além de adorar o produto, consegui uma promoção excelente. Valeu muito a pena.',
    author: 'Larissa Pereira',
    rating: 5,
  },
  {
    title: 'Satisfação garantida.',
    body: 'Tinha um pouco de receio ao comprar, mas o produto superou todas as minhas expectativas.',
    author: 'Lucas Martins',
    rating: 5,
  },
  {
    title: 'Cliente fiel.',
    body: 'Já é minha terceira compra nesta loja e sempre saio satisfeito. Continuarei voltando.',
    author: 'Patrícia Alves',
    rating: 5,
  },
  {
    title: 'Qualidade e confiança.',
    body: 'Não só o produto é ótimo, mas a marca sempre me passa confiança nas compras. Recomendo!',
    author: 'Bruno Rocha',
    rating: 5,
  },
]


function StarIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function StarRating({ rating }) {
  return (
    <div className="flex">
      {[...Array(5).keys()].map((index) => (
        <StarIcon
          key={index}
          className={clsx(
            'h-5 w-5',
            rating > index ? 'fill-indigo-500' : 'fill-gray-300',
          )}
        />
      ))}
    </div>
  )
}

function Review({ title, body, author, rating, className, ...props }) {
  let animationDelay = useMemo(() => {
    let possibleAnimationDelays = ['0s', '0.1s', '0.2s', '0.3s', '0.4s', '0.5s']
    return possibleAnimationDelays[
      Math.floor(Math.random() * possibleAnimationDelays.length)
    ]
  }, [])

  return (
    <figure
      className={clsx(
        'animate-fade-in rounded-3xl bg-white p-6 opacity-0 shadow-md shadow-gray-900/5',
        className,
      )}
      style={{ animationDelay }}
      {...props}
    >
      <blockquote className="text-gray-900">
        <StarRating rating={rating} />
        <p className="mt-4 text-lg font-semibold leading-6 before:content-['“'] after:content-['”']">
          {title}
        </p>
        <p className="mt-3 text-base leading-7">{body}</p>
      </blockquote>
      <figcaption className="mt-3 text-sm text-gray-600 before:content-['–_']">
        {author}
      </figcaption>
    </figure>
  )
}

function splitArray(array, numParts) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    let index = i % numParts
    if (!result[index]) {
      result[index] = []
    }
    result[index].push(array[i])
  }
  return result
}

function ReviewColumn({ reviews, className, reviewClassName, msPerPixel = 0 }) {
  let columnRef = useRef(null)
  let [columnHeight, setColumnHeight] = useState(0)
  let duration = `${columnHeight * msPerPixel}ms`

  useEffect(() => {
    if (!columnRef.current) {
      return
    }

    let resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0)
    })

    resizeObserver.observe(columnRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={columnRef}
      className={clsx('animate-marquee space-y-8 py-4', className)}
      style={{ '--marquee-duration': duration }}
    >
      {reviews.concat(reviews).map((review, reviewIndex) => (
        <Review
          key={reviewIndex}
          aria-hidden={reviewIndex >= reviews.length}
          className={reviewClassName?.(reviewIndex % reviews.length)}
          {...review}
        />
      ))}
    </div>
  )
}

function ReviewGrid() {
  let containerRef = useRef(null)
  let isInView = useInView(containerRef, { once: true, amount: 0.4 })
  let columns = splitArray(reviews, 3)
  let column1 = columns[0]
  let column2 = columns[1]
  let column3 = splitArray(columns[2], 2)

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView && (
        <>
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              clsx(
                reviewIndex >= column1.length + column3[0].length &&
                  'md:hidden',
                reviewIndex >= column1.length && 'lg:hidden',
              )
            }
            msPerPixel={10}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? 'lg:hidden' : ''
            }
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={column3.flat()}
            className="hidden lg:block"
            msPerPixel={10}
          />
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-50" />
    </div>
  )
}

export function Reviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="pb-16 pt-20 sm:pb-24 sm:pt-32"
    >
      <Container>
        <h2
          id="reviews-title"
          className="text-3xl font-medium tracking-tight text-gray-900 sm:text-center"
        >
         Veja os elogios da nossa plataforma
        </h2>
        <p className="mt-2 text-lg text-gray-600 sm:text-center">
        Conheça as experiências de nossos usuários.
        </p>
        <ReviewGrid />
      </Container>
    </section>
  )
}
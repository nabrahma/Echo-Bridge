import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { FeatureCards } from '@/components/home/feature-cards'
import { HowItWorks } from '@/components/home/how-it-works'

export const metadata: Metadata = {
  title: 'EchoBridge — Laptop Audio to Phone, Instantly',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureCards />
      <HowItWorks />
    </>
  )
}

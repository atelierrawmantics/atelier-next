import FeatureLayout from './components/feature-layout'

const FeatureAiDiagram = () => {
  return (
    <section>
      <FeatureLayout
        badgeText={'세 번째'}
        title={`AI로 자동 생성되는\n직관적인 작업 도식`}
        description={`작성한 작업지시가 AI로 자동 도식화됩니다.\n복잡한 설명 없이도 한눈에 이해할 수 있어요.`}
        bgUrl={"bg-[url('/images/landing/section3_3_content.png')]"}
        bgColor={
          'bg-[linear-gradient(208deg,#DDEFE0_6.35%,#FFFAF9_103.74%),linear-gradient(215deg,#D5E3FC_0.31%,#F6FAF6_104.05%)]'
        }
      />
    </section>
  )
}

export default FeatureAiDiagram
